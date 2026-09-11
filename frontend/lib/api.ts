export async function readApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data?.error?.message ?? data?.message ?? data?.error ?? 'Request failed';
  } catch {
    return response.statusText || 'Request failed';
  }
}

let refreshInProgress: Promise<Response> | null = null;

async function refreshSession(): Promise<Response> {
  if (!refreshInProgress) {
    refreshInProgress = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .finally(() => { refreshInProgress = null; });
  }
  return refreshInProgress;
}

export async function clientApiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (response.status === 401) {
    const refresh = await refreshSession();
    if (refresh.ok) {
      return fetch(path, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });
    }
    window.location.assign('/login');
  }

  return response;
}
