'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

const stages = [
  'applied',
  'screening',
  'interview',
  'final_interview',
  'offer',
  'hired',
  'rejected',
];

const stageLabels: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  final_interview: 'Final interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export default function ApplicationActions({
  applicationId,
  currentStage,
  interviewId,
}: {
  applicationId: string;
  currentStage: string;
  interviewId?: string;
}) {
  const [stage, setStage] = useState(currentStage);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function updateStage(event: React.FormEvent) {
    event.preventDefault();

    setBusy(true);
    setMessage(null);

    const response = await clientApiFetch(
      `/api/backend/applications/${applicationId}/stage`,
      {
        method: 'PATCH',
        body: JSON.stringify({ stage }),
      },
    );

    setMessage(
      response.ok
        ? 'Application stage updated.'
        : await readApiError(response),
    );

    setBusy(false);
  }

  async function scheduleInterview(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(true);
    setMessage(null);

    const data = new FormData(event.currentTarget);

    const response = await clientApiFetch(
      `/api/backend/applications/${applicationId}/interview`,
      {
        method: 'POST',
        body: JSON.stringify({
          scheduledAt: data.get('scheduledAt'),
          meetingLink: data.get('meetingLink'),
          notes: data.get('notes') || undefined,
        }),
      },
    );

    setMessage(
      response.ok
        ? 'Interview scheduled successfully.'
        : await readApiError(response),
    );

    setBusy(false);
  }

  async function submitFeedback(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!interviewId) return;

    setBusy(true);
    setMessage(null);

    const data = new FormData(event.currentTarget);

    const response = await clientApiFetch(
      `/api/backend/applications/interviews/${interviewId}/feedback`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          feedback: data.get('feedback'),
          outcome: data.get('outcome'),
        }),
      },
    );

    setMessage(
      response.ok
        ? 'Interview feedback saved.'
        : await readApiError(response),
    );

    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Application stage
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Move this application to the appropriate point in the hiring
            process.
          </p>
        </div>

        <form
          onSubmit={updateStage}
          className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-sm font-medium text-slate-700">
            Current stage
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              disabled={busy}
              className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {stages.map((value) => (
                <option key={value} value={value}>
                  {stageLabels[value]}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={busy || stage === currentStage}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Updating…' : 'Update stage'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Schedule interview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add the interview time, meeting link, and any useful context for
            the conversation.
          </p>
        </div>

        <form
          onSubmit={scheduleInterview}
          className="space-y-4 px-5 py-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Date and time
              <input
                name="scheduledAt"
                type="datetime-local"
                required
                disabled={busy}
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Meeting link
              <input
                name="meetingLink"
                type="url"
                required
                placeholder="https://..."
                disabled={busy}
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Notes
            <textarea
              name="notes"
              rows={4}
              placeholder="Optional interview notes..."
              disabled={busy}
              className="mt-2 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Scheduling…' : 'Schedule interview'}
          </button>
        </form>
      </section>

      {interviewId && (
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Interview feedback
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Record the outcome and feedback from the interview.
            </p>
          </div>

          <form
            onSubmit={submitFeedback}
            className="space-y-4 px-5 py-5"
          >
            <label className="block text-sm font-medium text-slate-700">
              Feedback
              <textarea
                name="feedback"
                required
                rows={5}
                placeholder="Add your interview feedback..."
                disabled={busy}
                className="mt-2 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Outcome
              <select
                name="outcome"
                defaultValue="moved_forward"
                disabled={busy}
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 sm:max-w-xs"
              >
                <option value="moved_forward">Move forward</option>
                <option value="rejected">Reject</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save feedback'}
            </button>
          </form>
        </section>
      )}

      {message && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}
    </div>
  );
}