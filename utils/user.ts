export const getDisplayName = (
  metadata: Record<string, unknown>,
  email: string | undefined,
) => {
  const candidateKeys = [
    'name',
    'full_name',
    'user_name',
    'preferred_username',
  ];

  for (const key of candidateKeys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return email ?? 'Player One';
};
