'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function EditJobForm({ jobId, job }: { jobId: string; job: { title: string; description?: string; location?: string; employment_type?: string } }) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await clientApiFetch(`/api/backend/jobs/${jobId}`, { method: 'PATCH', body: JSON.stringify(values) });
    setMessage(response.ok ? 'Job updated.' : await readApiError(response));
    setBusy(false);
  }
  return <form onSubmit={submit} className="space-y-3 rounded-xl border p-5"><h2 className="font-semibold">Edit job</h2><input name="title" defaultValue={job.title} required className="w-full rounded border px-3 py-2" /><textarea name="description" defaultValue={job.description ?? ''} rows={5} className="w-full rounded border px-3 py-2" /><input name="location" defaultValue={job.location ?? ''} className="w-full rounded border px-3 py-2" /><select name="employment_type" defaultValue={job.employment_type ?? ''} className="rounded border px-3 py-2"><option value="">Employment type</option><option value="full_time">Full-time</option><option value="part_time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select><button disabled={busy} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">Save changes</button>{message && <p className="text-sm text-gray-600">{message}</p>}</form>;
}
