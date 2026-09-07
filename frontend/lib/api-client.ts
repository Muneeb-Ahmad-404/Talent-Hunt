let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((response) => response.ok)
      .finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export async function clientApiFetch(path: string, options: RequestInit = {}) {
  const request = () => fetch(path.startsWith('/api/') ? path : `/api${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  let response = await request();
  if (response.status === 401 && await refreshAccessToken()) response = await request();
  return response;
}

export const apiRouter = {
  applications: {
    scheduleInterview: (id: string, body: object) => clientApiFetch(`/applications/${id}/interview`, { method: 'POST', body: JSON.stringify(body) }),
    feedback: (id: string, body: object) => clientApiFetch(`/applications/interviews/${id}/feedback`, { method: 'PATCH', body: JSON.stringify(body) }),
  },
};
