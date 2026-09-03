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
