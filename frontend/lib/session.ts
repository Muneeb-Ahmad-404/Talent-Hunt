import { apiFetch } from './server-api';
import type { User } from './types';

export async function getCurrentUser(): Promise<User | null> {
  const response = await apiFetch('/api/auth/me');
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error('Unable to load the current session');
  const data: { user: User } = await response.json();
  return data.user;
}
