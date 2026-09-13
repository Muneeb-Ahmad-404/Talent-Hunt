'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientApiFetch, readApiError } from '@/lib/api';
import Link from 'next/link';

type ScreeningQuestion = {
  text: string;
  type: 'text' | 'boolean' | 'url';
  required: boolean;
};

export default function NewJobPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >([]);

  const [questionInput, setQuestionInput] = useState('');
  const [questionType, setQuestionType] =
    useState<ScreeningQuestion['type']>('text');
  const [questionRequired, setQuestionRequired] = useState(true);

  function addQuestion() {
    const text = questionInput.trim();

    if (!text) {
      return;
    }

    setScreeningQuestions((current) => [
      ...current,
      {
        text,
        type: questionType,
        required: questionRequired,
      },
    ]);

    setQuestionInput('');
    setQuestionType('text');
    setQuestionRequired(true);
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

    const title = (form.get('title') as string)?.trim();
    const description = (form.get('description') as string)?.trim();

    if (!description) {
      setError('Description is required.');
      setLoading(false);
      return;
    }

    const attributes = {
      skills: (form.get('skills') as string)?.trim() || '',
      experience: (form.get('experience') as string)?.trim() || '',
      education: (form.get('education') as string)?.trim() || '',
    };

    const body = {
      title,
      description,
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

    const res = await clientApiFetch('/api/jobs', {
      method: 'POST',
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
            Add the details candidates need to understand the position and
            submit an application.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Position details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information about the position.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Job title <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    Describe the role, responsibilities, and what the
                    successful candidate will work on.
                  </p>

                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={8}
                    placeholder="Describe the position..."
                    className="mt-3 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Employment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define where and how the role is structured.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    placeholder="e.g. Lahore, Pakistan"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="employment_type"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Employment type
                  </label>

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

                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Application deadline
                  </label>

                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Compensation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Optionally provide the expected salary range.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="salary_min"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Minimum salary
                  </label>

                  <input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    min="1"
                    placeholder="e.g. 150000"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salary_max"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Maximum salary
                  </label>

                  <input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    min="1"
                    placeholder="e.g. 250000"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section className="border-b border-slate-200 px-6 py-7 sm:px-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Requirements
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add the main qualifications you are looking for.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Skills
                  </label>

                  <input
                    id="skills"
                    name="skills"
                    placeholder="e.g. Node.js, PostgreSQL, TypeScript, Docker"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Experience
                  </label>

                  <input
                    id="experience"
                    name="experience"
                    placeholder="e.g. 3+ years of backend development"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Education
                  </label>

                  <input
                    id="education"
                    name="education"
                    placeholder="e.g. Bachelor's degree in Computer Science"
                    className="mt-3 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
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
                <div className="space-y-3">
                  <input
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addQuestion();
                      }
                    }}
                    maxLength={500}
                    placeholder="e.g. Why are you interested in this position?"
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={questionType}
                      onChange={(e) =>
                        setQuestionType(
                          e.target.value as ScreeningQuestion['type'],
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                    >
                      <option value="text">Text</option>
                      <option value="boolean">Yes / No</option>
                      <option value="url">URL</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={questionRequired}
                        onChange={(e) =>
                          setQuestionRequired(e.target.checked)
                        }
                      />
                      Required
                    </label>

                    <button
                      type="button"
                      onClick={addQuestion}
                      disabled={!questionInput.trim()}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto"
                    >
                      Add question
                    </button>
                  </div>
                </div>

                {screeningQuestions.length > 0 ? (
                  <div className="space-y-2">
                    {screeningQuestions.map((question, index) => (
                      <div
                        key={`${question.text}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 shrink-0 text-sm font-semibold text-slate-500">
                            {index + 1}.
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-6 text-slate-800">
                              {question.text}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {question.type === 'text'
                                ? 'Text'
                                : question.type === 'boolean'
                                  ? 'Yes / No'
                                  : 'URL'}
                              {' · '}
                              {question.required ? 'Required' : 'Optional'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="shrink-0 text-sm font-medium text-slate-400 transition hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
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

            {error && (
              <div className="border-t border-red-100 bg-red-50 px-6 py-4 sm:px-8">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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