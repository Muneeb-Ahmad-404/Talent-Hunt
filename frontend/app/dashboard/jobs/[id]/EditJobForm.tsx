'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

type ScreeningQuestion = {
  text: string;
  type: 'text' | 'boolean' | 'url';
  required: boolean;
};

type Job = {
  title: string;
  description?: string | null;
  location?: string | null;
  employment_type?: string | null;
  deadline?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  attributes?: {
    skills?: string;
    experience?: string;
    education?: string;
  } | null;
  screening_questions?: ScreeningQuestion[] | null;
};

export default function EditJobForm({
  jobId,
  job,
}: {
  jobId: string;
  job: Job;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >(job.screening_questions ?? []);

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] =
    useState<ScreeningQuestion['type']>('text');
  const [questionRequired, setQuestionRequired] = useState(true);

  function addScreeningQuestion() {
    const text = questionText.trim();

    if (!text) return;

    setScreeningQuestions((current) => [
      ...current,
      {
        text,
        type: questionType,
        required: questionRequired,
      },
    ]);

    setQuestionText('');
    setQuestionType('text');
    setQuestionRequired(true);
  }

  function removeScreeningQuestion(index: number) {
    setScreeningQuestions((current) =>
      current.filter((_, questionIndex) => questionIndex !== index),
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setBusy(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);

    const attributes = {
      skills: (form.get('skills') as string)?.trim() || '',
      experience: (form.get('experience') as string)?.trim() || '',
      education: (form.get('education') as string)?.trim() || '',
    };

    const body = {
      title: (form.get('title') as string)?.trim(),
      description: (form.get('description') as string)?.trim(),
      location: (form.get('location') as string)?.trim() || undefined,
      employment_type:
        (form.get('employment_type') as string)?.trim() || undefined,
      deadline: (form.get('deadline') as string)?.trim() || undefined,
      salary_min: form.get('salary_min')
        ? Number(form.get('salary_min'))
        : undefined,
      salary_max: form.get('salary_max')
        ? Number(form.get('salary_max'))
        : undefined,
      attributes,
      screening_questions: screeningQuestions,
    };

    const response = await clientApiFetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    setMessage(
      response.ok ? 'Job updated.' : await readApiError(response),
    );

    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Edit job
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the details of this job posting.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Position title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={job.title}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={job.description ?? ''}
              required
              rows={8}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                defaultValue={job.location ?? ''}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="employment_type"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Employment type
              </label>
              <select
                id="employment_type"
                name="employment_type"
                defaultValue={job.employment_type ?? ''}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="full_time">Full time</option>
                <option value="part_time">Part time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="deadline"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Application deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={
                  job.deadline ? job.deadline.slice(0, 10) : ''
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="salary_min"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Minimum salary
              </label>
              <input
                id="salary_min"
                name="salary_min"
                type="number"
                min="0"
                defaultValue={job.salary_min ?? ''}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="salary_max"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Maximum salary
              </label>
              <input
                id="salary_max"
                name="salary_max"
                type="number"
                min="0"
                defaultValue={job.salary_max ?? ''}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Requirements
          </h2>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="skills"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              defaultValue={job.attributes?.skills ?? ''}
              placeholder="e.g. Node.js, PostgreSQL, Docker"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="experience"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Experience
            </label>
            <input
              id="experience"
              name="experience"
              defaultValue={job.attributes?.experience ?? ''}
              placeholder="e.g. 2+ years"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="education"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Education
            </label>
            <input
              id="education"
              name="education"
              defaultValue={job.attributes?.education ?? ''}
              placeholder="e.g. BS Computer Science"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Screening questions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add questions applicants should answer when applying.
          </p>
        </div>

        <div className="space-y-3">
          {screeningQuestions.map((question, index) => (
            <div
              key={`${index}-${question.text}`}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {index + 1}. {question.text}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {question.type} ·{' '}
                  {question.required ? 'Required' : 'Optional'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeScreeningQuestion(index)}
                className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="rounded-lg border border-dashed border-slate-300 p-4">
            <div className="space-y-4">
              <input
                type="text"
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="Enter a screening question"
                maxLength={500}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <select
                  value={questionType}
                  onChange={(event) =>
                    setQuestionType(
                      event.target.value as ScreeningQuestion['type'],
                    )
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="text">Text</option>
                  <option value="boolean">Yes / No</option>
                  <option value="url">URL</option>
                </select>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={questionRequired}
                    onChange={(event) =>
                      setQuestionRequired(event.target.checked)
                    }
                  />
                  Required
                </label>

                <button
                  type="button"
                  onClick={addScreeningQuestion}
                  disabled={!questionText.trim()}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {message ? (
          <p
            className={`text-sm ${
              message === 'Job updated.'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}