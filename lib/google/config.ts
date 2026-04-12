export const getGoogleClientEnv = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Google env vars: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    );
  }

  return { clientId, clientSecret };
};

export const getGoogleEnv = () => {
  const { clientId, clientSecret } = getGoogleClientEnv();
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  if (!clientId || !clientSecret || !rootFolderId) {
    throw new Error(
      'Missing Google env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_DRIVE_ROOT_FOLDER_ID.',
    );
  }

  return { clientId, clientSecret, rootFolderId };
};
