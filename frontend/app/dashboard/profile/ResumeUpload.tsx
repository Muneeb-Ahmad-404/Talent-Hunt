'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function ResumeUpload() {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const start = await clientApiFetch('/api/applicants/profile/resume-upload', { method: 'POST' });
      if (!start.ok) throw new Error(await readApiError(start));
      const { uploadUrl, key } = await start.json();
      const storage = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': 'application/pdf' } });
      if (!storage.ok) throw new Error('Resume upload failed.');
      const confirm = await clientApiFetch('/api/applicants/profile/resume', {
        method: 'POST',
        body: JSON.stringify({ key, filename: file.name }),
      });
      if (!confirm.ok) throw new Error(await readApiError(confirm));
      setMessage('Resume uploaded successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Resume upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="mt-4"><input type="file" accept="application/pdf" onChange={upload} disabled={busy} />{message && <p className="mt-2 text-sm text-gray-600">{message}</p>}</div>;
}
