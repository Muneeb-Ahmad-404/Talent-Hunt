'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function InviteMember() {
  const [message, setMessage] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await clientApiFetch('/api/backend/companies/invitations', { method: 'POST', body: JSON.stringify(values) });
    setMessage(response.ok ? 'Invitation sent.' : await readApiError(response));
    if (response.ok) event.currentTarget.reset();
  }
  return <form onSubmit={submit} className="mb-6 flex flex-wrap gap-2"><input name="email" type="email" required placeholder="teammate@example.com" className="rounded border px-3 py-2 text-sm" /><select name="role" defaultValue="recruiter" className="rounded border px-3 py-2 text-sm"><option value="hr_manager">HR manager</option><option value="recruiter">Recruiter</option><option value="hiring_manager">Hiring manager</option></select><button className="rounded bg-blue-600 px-4 py-2 text-sm text-white">Invite</button>{message && <span className="self-center text-sm text-gray-600">{message}</span>}</form>;
}
