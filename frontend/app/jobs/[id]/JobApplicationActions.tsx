'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function JobApplicationActions({ jobId, questions }: { jobId: string; questions: Array<{ text: string; type: 'text' | 'boolean' | 'url'; required: boolean }> }) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));

  async function apply() {
    setBusy(true);
    const missing = questions.some((question, index) => question.required && !answers[index].trim());
    if (missing) {
      setMessage('Please answer all required questions.');
      setBusy(false);
      return;
    }
    const response = await clientApiFetch('/api/applicants/apply', {
      method: 'POST',
      body: JSON.stringify({ jobIds: [jobId], answers: { [jobId]: answers } }),
    });
    setMessage(response.ok ? 'Application submitted.' : await readApiError(response));
    setBusy(false);
  }

  async function shortlist() {
    setBusy(true);
    const response = await clientApiFetch('/api/applicants/shortlist', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
    setMessage(response.ok ? 'Added to your shortlist.' : await readApiError(response));
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      {questions.length > 0 && <div className="space-y-3 rounded-xl border p-4"><h2 className="font-semibold">Application questions</h2>{questions.map((question, index) => <label key={`${question.text}-${index}`} className="block text-sm font-medium">{question.text}{question.required ? ' *' : ''}{question.type === 'boolean' ? <select value={answers[index]} onChange={(e) => setAnswers((current) => current.map((value, i) => i === index ? e.target.value : value))} className="mt-1 block w-full rounded border px-3 py-2"><option value="">Choose an answer</option><option value="true">Yes</option><option value="false">No</option></select> : <input type={question.type === 'url' ? 'url' : 'text'} value={answers[index]} onChange={(e) => setAnswers((current) => current.map((value, i) => i === index ? e.target.value : value))} className="mt-1 block w-full rounded border px-3 py-2" />}</label>)}</div>}
      <div className="flex gap-3">
        <button onClick={apply} disabled={busy} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">Apply</button>
        <button onClick={shortlist} disabled={busy} className="rounded border px-4 py-2 disabled:opacity-50">Shortlist</button>
        {message && <p className="self-center text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
