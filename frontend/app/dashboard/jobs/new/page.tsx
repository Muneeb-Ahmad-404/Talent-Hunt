'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientApiFetch, readApiError } from '@/lib/api';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [questionInput, setQuestionInput] = useState('');

  function addQuestion() {
    const question = questionInput.trim();

    if (!question) {
      return;
    }

    setScreeningQuestions((current) => [...current, question]);
    setQuestionInput('');
  }

  function removeQuestion(index: number) {
    setScreeningQuestions((current) =>
      current.filter((_, questionIndex) => questionIndex !== index),
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const fields = [
      'title',
      'description',
      'location',
      'employment_type',
    ];

    const body = {
      ...Object.fromEntries(
        fields
          .map((key) => [key, (form.get(key) as string)?.trim()])
          .filter(([_, value]) => value),
      ),
      screeningQuestions,
    };

    const res = await clientApiFetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const { jobId } = await res.json();
      router.push(`/dashboard/jobs/${jobId}`);
    } else {
      setError(await readApiError(res));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-full">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/jobs"
            className="mb-5 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span className="mr-2">←</span>
            Back to jobs
          </Link>

          <p className="text-sm font-medium text-slate-500">
            Company workspace
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Post a job
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add the basic details for your new position. You can review and
            manage the job after it has been created.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Basic information */}
            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Position details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Start with the information candidates need to understand the
                  role.
                </p>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Job title <span className="text-red-500">*</span>
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    Use a clear, recognizable title such as Senior Backend
                    Engineer.
                  </p>

                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Description
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    Describe the role, responsibilities, and what the
                    successful candidate will work on.
                  </p>

                  <textarea
                    id="description"
                    name="description"
                    rows={8}
                    placeholder="Describe the position..."
                    className="mt-3 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            {/* Employment information */}
            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Employment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Give candidates the basic context about where and how the
                  role is structured.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Location
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    City, country, or a remote location.
                  </p>

                  <input
                    id="location"
                    name="location"
                    placeholder="e.g. Lahore, Pakistan"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                {/* Employment type */}
                <div>
                  <label
                    htmlFor="employment_type"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Employment type
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose the arrangement for this position.
                  </p>

                  <select
                    id="employment_type"
                    name="employment_type"
                    defaultValue=""
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">Select employment type</option>
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Screening questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add questions applicants must answer before submitting their
                  application.
                </p>
              </div>

              <div className="space-y-5">
                {/* Add question */}
                <div>
                  <label
                    htmlFor="screening-question"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Question
                  </label>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="screening-question"
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addQuestion();
                        }
                      }}
                      placeholder="e.g. Why are you interested in this position?"
                      className="block min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />

                    <button
                      type="button"
                      onClick={addQuestion}
                      disabled={!questionInput.trim()}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add question
                    </button>
                  </div>
                </div>

                {/* Questions list */}
                {screeningQuestions.length > 0 ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Questions
                    </h3>

                    <div className="mt-3 space-y-2">
                      {screeningQuestions.map((question, index) => (
                        <div
                          key={`${question}-${index}`}
                          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <span className="mt-0.5 shrink-0 text-sm font-semibold text-slate-500">
                            {index + 1}.
                          </span>

                          <p className="min-w-0 flex-1 text-sm leading-6 text-slate-800">
                            {question}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="shrink-0 text-sm font-medium text-slate-400 transition hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 px-4 py-5 text-center">
                    <p className="text-sm text-slate-500">
                      No screening questions added.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="border-t border-red-100 bg-red-50 px-6 py-4 sm:px-8">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-slate-500">
                The job will be saved as a draft.
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/jobs"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Save as draft'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}