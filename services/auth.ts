import { createClient } from '@/lib/supabase/client';

type AuthApiErrorResponse = {
  error?: string;
};

export type SendOtpInput = {
  email: string;
};

export type VerifyOtpInput = {
  email: string;
  otp: string;
};

const DEFAULT_AUTH_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const parseResponseError = async (response: Response) => {
  try {
    const data = (await response.json()) as AuthApiErrorResponse;
    return data.error ?? DEFAULT_AUTH_ERROR_MESSAGE;
  } catch {
    return DEFAULT_AUTH_ERROR_MESSAGE;
  }
};

const postJson = async (url: string, body: unknown) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseResponseError(response));
  }
};

export const sendOtp = async ({ email }: SendOtpInput) => {
  await postJson('/api/auth/send-otp', { email });
};

export const verifyOtp = async ({ email, otp }: VerifyOtpInput) => {
  await postJson('/api/auth/verify-otp', { email, otp });
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || 'Could not sign out. Please try again.');
  }
};
