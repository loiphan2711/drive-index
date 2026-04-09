const DEFAULT_FETCH_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
};

const getErrorMessage = (info: unknown) => {
  if (typeof info === 'string' && info) {
    return info;
  }

  if (
    info &&
    typeof info === 'object' &&
    'error' in info &&
    typeof info.error === 'string' &&
    info.error
  ) {
    return info.error;
  }

  return DEFAULT_FETCH_ERROR_MESSAGE;
};

export class FetchError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = 'FetchError';
    this.info = info;
    this.status = status;
  }
}

export const jsonFetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  const info = await parseResponseBody(response);

  if (!response.ok) {
    throw new FetchError(getErrorMessage(info), response.status, info);
  }

  return info as T;
};
