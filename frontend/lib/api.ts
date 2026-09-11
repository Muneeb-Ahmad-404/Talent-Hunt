export async function readApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data?.error?.message ?? data?.message ?? data?.error ?? 'Request failed';
  } catch {
    return response.statusText || 'Request failed';
  }
}

export async function clientApiFetch(
  path: string,
  options: RequestInit = {},
) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    window.location.assign('/login');
  }

  return response;
}
