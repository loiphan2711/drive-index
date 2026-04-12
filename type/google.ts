export type GoogleTokens = {
  access_token: string;
  refresh_token: string;
  expiry_date: number | null;
};

export type GoogleOAuthClient = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type GoogleAuthenticatedClient = GoogleOAuthClient & GoogleTokens;

export type GoogleOAuthTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

export type GoogleDriveFile = {
  fileExtension?: string | null;
  id?: string | null;
  mimeType?: string | null;
  modifiedTime?: string | null;
  name?: string | null;
  size?: string | null;
  thumbnailLink?: string | null;
};

export type GoogleDriveListResponse = {
  error?:
    | {
        code?: number;
        message?: string;
      }
    | string;
  files?: GoogleDriveFile[] | null;
};

export type GoogleSharedDrive = {
  id?: string | null;
  kind?: string | null;
  name?: string | null;
};

export type GoogleSharedDrivesListResponse = {
  drives?: GoogleSharedDrive[] | null;
  error?:
    | {
        code?: number;
        message?: string;
      }
    | string;
};
