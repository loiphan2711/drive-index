import { NextResponse } from 'next/server';

import { parseAllowedEmails, toAllowedEmail } from '@/lib/auth/allowlist';
import { createClient } from '@/lib/supabase/server';

type SendOtpPayload = {
  email?: string;
};

const readJsonBody = async (
  request: Request,
): Promise<SendOtpPayload | null> => {
  try {
    return (await request.json()) as SendOtpPayload;
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  if (!payload || typeof payload.email !== 'string') {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const email = toAllowedEmail(payload.email);
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
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

  const requestUrl = new URL(request.url);
  const callbackUrl = new URL('/auth/callback', requestUrl.origin);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
