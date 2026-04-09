const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const parseAllowedEmails = () =>
  (process.env.ALLOWED_EMAILS ?? '')
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean);

export const toAllowedEmail = (value: string) => normalizeEmail(value);
