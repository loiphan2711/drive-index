import { NextResponse } from 'next/server';

import { parseAllowedEmails, toAllowedEmail } from '@/lib/auth/allowlist';
import { createClient } from '@/lib/supabase/server';

type VerifyOtpPayload = {
  email?: string;
  otp?: string;
};

const readJsonBody = async (
  request: Request,
): Promise<VerifyOtpPayload | null> => {
  try {
    return (await request.json()) as VerifyOtpPayload;
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  if (
    !payload ||
    typeof payload.email !== 'string' ||
    typeof payload.otp !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const email = toAllowedEmail(payload.email);
  const otp = payload.otp.trim();

  if (!email || !otp) {
    return NextResponse.json(
      { error: 'Email and OTP are required.' },
      { status: 400 },
    );
  }

  const allowedEmails = parseAllowedEmails();
  if (!allowedEmails.length) {
    return NextResponse.json(
      { error: 'ALLOWED_EMAILS is not configured.' },
      { status: 500 },
    );
  }

  if (!allowedEmails.includes(email)) {
    return NextResponse.json(
      { error: 'Email is not allowed to sign in.' },
      { status: 403 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error) {
    return NextResponse.json(
      { error: 'Verification code is invalid.' },
      { status: 401 },
    );
  }

  return NextResponse.json({ success: true });
}
