export async function readApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return (
      data?.error?.message ??
      data?.message ??
      data?.error ??
      'Request failed'
    );
  } catch {
    return response.statusText || 'Request failed';
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