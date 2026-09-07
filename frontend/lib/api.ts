import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

function backendUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized.startsWith('/api/') ? normalized : `/api${normalized}`}`;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  return fetch(backendUrl(path), { ...options, headers, cache: 'no-store' });
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    }).then((response) => response.ok).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export async function clientApiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
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
  auth: {
    me: () => clientApiFetch('/auth/me'),
    logout: () => clientApiFetch('/auth/logout', { method: 'POST' }),
  },
  public: {
    jobs: (query = '') => clientApiFetch(`/public/jobs${query}`),
    job: (id: string) => clientApiFetch(`/public/jobs/${id}`),
  },
  applications: {
    pipeline: () => clientApiFetch('/applications'),
    moveStage: (id: string, stage: string) => clientApiFetch(`/applications/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
    scheduleInterview: (id: string, body: object) => clientApiFetch(`/applications/${id}/interview`, { method: 'POST', body: JSON.stringify(body) }),
    feedback: (id: string, body: object) => clientApiFetch(`/applications/interviews/${id}/feedback`, { method: 'PATCH', body: JSON.stringify(body) }),
  },
  companies: {
    me: () => clientApiFetch('/companies/me'),
    members: () => clientApiFetch('/companies/members'),
    invite: (body: object) => clientApiFetch('/companies/invitations', { method: 'POST', body: JSON.stringify(body) }),
  },
  applicants: {
    profile: () => clientApiFetch('/applicants/profile'),
    applications: () => clientApiFetch('/applicants/applications'),
    shortlist: () => clientApiFetch('/applicants/shortlist'),
    apply: (body: object) => clientApiFetch('/applicants/apply', { method: 'POST', body: JSON.stringify(body) }),
    addShortlist: (jobId: string) => clientApiFetch('/applicants/shortlist', { method: 'POST', body: JSON.stringify({ jobId }) }),
    removeShortlist: (jobId: string) => clientApiFetch(`/applicants/shortlist/${jobId}`, { method: 'DELETE' }),
  },
  admin: {
    companies: (query = '') => clientApiFetch(`/admin/companies${query}`),
    jobs: (query = '') => clientApiFetch(`/admin/jobs${query}`),
    users: (query = '') => clientApiFetch(`/admin/users${query}`),
  },
};
