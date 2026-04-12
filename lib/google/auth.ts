import type {
  GoogleAuthenticatedClient,
  GoogleOAuthClient,
  GoogleOAuthTokenResponse,
  GoogleTokens,
} from '@/type/google';

import { PAGE_PATHS } from '@/constants/path';

import { getGoogleClientEnv } from './config';

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const GOOGLE_OAUTH_AUTHORIZE_URL =
  'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_OAUTH_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export const GOOGLE_OAUTH_STATE_COOKIE = 'google_drive_oauth_state';
export const GOOGLE_TOKEN_EXPIRY_SKEW_MS = 60_000;

export class GoogleTokenRefreshError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleTokenRefreshError';
  }
}

const buildRedirectUri = (origin: string) =>
  new URL(PAGE_PATHS.googleAuthCallback, origin).toString();

const getGoogleErrorMessage = (
  payload: GoogleOAuthTokenResponse | null,
  fallback: string,
) => {
  if (!payload) {
    return fallback;
  }

  if (payload.error_description) {
    return payload.error_description;
  }

  if (payload.error) {
    return payload.error;
  }

  return fallback;
};

const parseGoogleOAuthResponse = async (
  response: Response,
): Promise<GoogleOAuthTokenResponse | null> => {
  try {
    return (await response.json()) as GoogleOAuthTokenResponse;
  } catch {
    return null;
  }
};

const normalizeGoogleTokens = (
  payload: GoogleOAuthTokenResponse,
  currentRefreshToken?: string | null,
): GoogleTokens => {
  if (!payload.access_token) {
    throw new Error('Google OAuth response did not include an access token.');
  }

  const refreshToken = payload.refresh_token ?? currentRefreshToken ?? null;
  if (!refreshToken) {
    throw new Error('Google OAuth response did not include a refresh token.');
  }

  return {
    access_token: payload.access_token,
    refresh_token: refreshToken,
    expiry_date:
      typeof payload.expires_in === 'number'
        ? Date.now() + payload.expires_in * 1000
        : null,
  };
};

export const createGoogleOAuth2Client = (origin: string): GoogleOAuthClient => {
  const { clientId, clientSecret } = getGoogleClientEnv();

  return {
    clientId,
    clientSecret,
    redirectUri: buildRedirectUri(origin),
  };
};

export const createAuthenticatedClient = (
  tokens: GoogleTokens,
  origin: string,
): GoogleAuthenticatedClient => ({
  ...createGoogleOAuth2Client(origin),
  ...tokens,
});

export const generateGoogleAuthUrl = (origin: string, state: string) => {
  const client = createGoogleOAuth2Client(origin);
  const url = new URL(GOOGLE_OAUTH_AUTHORIZE_URL);

  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('client_id', client.clientId);
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('redirect_uri', client.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', GOOGLE_DRIVE_SCOPE);
  url.searchParams.set('state', state);

  return url.toString();
};

export const exchangeGoogleCodeForTokens = async (
  origin: string,
  code: string,
) => {
  const client = createGoogleOAuth2Client(origin);
  const body = new URLSearchParams({
    client_id: client.clientId,
    client_secret: client.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: client.redirectUri,
  });

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  const payload = await parseGoogleOAuthResponse(response);

  if (!response.ok || !payload) {
    throw new Error(
      getGoogleErrorMessage(payload, 'Could not finish Google OAuth exchange.'),
    );
  }

  return normalizeGoogleTokens(payload);
};

export const refreshGoogleAccessToken = async (
  client: GoogleAuthenticatedClient,
) => {
  try {
    const body = new URLSearchParams({
      client_id: client.clientId,
      client_secret: client.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: client.refresh_token,
    });

    const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      cache: 'no-store',
    });

    const payload = await parseGoogleOAuthResponse(response);

    if (!response.ok || !payload) {
      throw new GoogleTokenRefreshError(
        getGoogleErrorMessage(
          payload,
          'Could not refresh Google Drive access.',
        ),
      );
    }

    return normalizeGoogleTokens(payload, client.refresh_token);
  } catch (error) {
    if (error instanceof GoogleTokenRefreshError) {
      throw error;
    }

    throw new GoogleTokenRefreshError(
      error instanceof Error
        ? error.message
        : 'Could not refresh Google Drive access.',
    );
  }
};

export const revokeGoogleToken = async (token: string) => {
  const body = new URLSearchParams({ token });
  const response = await fetch(GOOGLE_OAUTH_REVOKE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!response.ok && response.status !== 400) {
    throw new Error('Could not revoke the Google Drive token.');
  }
};

export const isGoogleTokenExpired = (tokens: GoogleTokens) => {
  if (!tokens.expiry_date) {
    return false;
  }

  return tokens.expiry_date <= Date.now() + GOOGLE_TOKEN_EXPIRY_SKEW_MS;
};
