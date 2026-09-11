'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function ProfileEditor({ profile }: { profile: { headline?: string; bio?: string; skills?: string[] } }) {
  const [headline, setHeadline] = useState(profile.headline ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [skills, setSkills] = useState((profile.skills ?? []).join(', '));
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const response = await clientApiFetch('/api/backend/applicants/profile', {
      method: 'PATCH',
      body: JSON.stringify({ headline, bio, skills: skills.split(',').map((value) => value.trim()).filter(Boolean) }),
    });
    setMessage(response.ok ? 'Profile saved.' : await readApiError(response));
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <label className="block text-sm font-medium">Headline<input value={headline} onChange={(e) => setHeadline(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Bio<textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Skills <span className="font-normal text-gray-500">(comma separated)</span><input value={skills} onChange={(e) => setSkills(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
      <button disabled={busy} className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">{busy ? 'Saving...' : 'Save profile'}</button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
