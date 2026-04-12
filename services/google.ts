type GoogleErrorResponse = {
  error?: string;
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const parseGoogleError = async (response: Response) => {
  try {
    const payload = (await response.json()) as GoogleErrorResponse;

    return payload.error ?? DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
};

export const disconnectGoogle = async () => {
  const response = await fetch('/api/drive/auth/disconnect', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(await parseGoogleError(response));
  }
};
