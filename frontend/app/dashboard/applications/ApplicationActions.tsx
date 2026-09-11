'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

const stages = ['applied', 'screening', 'interview', 'final_interview', 'offer', 'hired', 'rejected'];

export default function ApplicationActions({ applicationId, currentStage, interviewId }: { applicationId: string; currentStage: string; interviewId?: string }) {
  const [stage, setStage] = useState(currentStage);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function updateStage(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const response = await clientApiFetch(`/api/backend/applications/${applicationId}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) });
    setMessage(response.ok ? 'Stage updated.' : await readApiError(response));
    setBusy(false);
  }

  async function scheduleInterview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const response = await clientApiFetch(`/api/backend/applications/${applicationId}/interview`, {
      method: 'POST',
      body: JSON.stringify({ scheduledAt: data.get('scheduledAt'), meetingLink: data.get('meetingLink'), notes: data.get('notes') || undefined }),
    });
    setMessage(response.ok ? 'Interview scheduled.' : await readApiError(response));
    setBusy(false);
  }

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!interviewId) return;
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const response = await clientApiFetch(`/api/backend/applications/interviews/${interviewId}/feedback`, {
      method: 'PATCH',
      body: JSON.stringify({ feedback: data.get('feedback'), outcome: data.get('outcome') }),
    });
    setMessage(response.ok ? 'Interview feedback saved.' : await readApiError(response));
    setBusy(false);
  }

  return <div className="space-y-6">
    <form onSubmit={updateStage} className="flex flex-wrap items-end gap-3">
      <label className="text-sm font-medium">Move stage<select value={stage} onChange={(e) => setStage(e.target.value)} className="mt-1 block rounded border px-3 py-2">{stages.map((value) => <option key={value}>{value}</option>)}</select></label>
      <button disabled={busy} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">Update stage</button>
    </form>
    <form onSubmit={scheduleInterview} className="space-y-3 rounded-xl border p-4">
      <h2 className="font-semibold">Schedule interview</h2>
      <input name="scheduledAt" type="datetime-local" required className="rounded border px-3 py-2" />
      <input name="meetingLink" placeholder="Meeting link" required className="rounded border px-3 py-2" />
      <textarea name="notes" placeholder="Notes (optional)" className="block w-full rounded border px-3 py-2" />
      <button disabled={busy} className="rounded border px-4 py-2 text-sm">Schedule</button>
    </form>
    {interviewId && <form onSubmit={submitFeedback} className="space-y-3 rounded-xl border p-4"><h2 className="font-semibold">Interview feedback</h2><textarea name="feedback" required placeholder="Feedback" className="block w-full rounded border px-3 py-2" /><select name="outcome" defaultValue="moved_forward" className="rounded border px-3 py-2"><option value="moved_forward">Move forward</option><option value="rejected">Reject</option></select><button disabled={busy} className="rounded border px-4 py-2 text-sm">Save feedback</button></form>}
    {message && <p className="text-sm text-gray-600">{message}</p>}
  </div>;
}
