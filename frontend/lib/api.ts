export async function readApiError(
  response: Response,
  fallback = 'Request failed. Please try again.',
): Promise<string> {
  try {
    const data = await response.json();
    const error = data?.error;

    if (
      error?.code === 'VALIDATION_ERROR' &&
      Array.isArray(error.details)
    ) {
      const messages = error.details
        .map((detail: unknown) =>
          typeof detail === 'object' &&
          detail !== null &&
          'message' in detail &&
          typeof detail.message === 'string'
            ? detail.message
            : null,
        )
        .filter((message: string | null): message is string => message !== null);

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function clientApiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const makeRequest = () =>
    fetch(path, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

  let response = await makeRequest();

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshResponse.ok) {
    window.location.assign('/login');
    return response;
  }

  response = await makeRequest();

  if (response.status === 401) {
    window.location.assign('/login');
  }

  return response;
}