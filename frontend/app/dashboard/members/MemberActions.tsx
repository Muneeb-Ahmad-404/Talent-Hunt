'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function MemberActions({ recruiterId, role, owner }: { recruiterId: string; role: string; owner: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  async function update(nextRole: string) {
    const response = await clientApiFetch(`/api/backend/companies/members/${recruiterId}`, { method: 'PATCH', body: JSON.stringify({ role: nextRole }) });
    setMessage(response.ok ? 'Role updated.' : await readApiError(response));
  }
  async function remove() {
    const response = await clientApiFetch(`/api/backend/companies/members/${recruiterId}`, { method: 'DELETE' });
    setMessage(response.ok ? 'Member removed.' : await readApiError(response));
  }
  if (!owner) return null;
  return <div className="flex items-center gap-2"><select defaultValue={role} onChange={(e) => update(e.target.value)} className="rounded border px-2 py-1 text-xs"><option value="hr_manager">HR manager</option><option value="recruiter">Recruiter</option><option value="hiring_manager">Hiring manager</option></select><button onClick={remove} className="text-xs text-red-600">Remove</button>{message && <span className="text-xs text-gray-500">{message}</span>}</div>;
}
