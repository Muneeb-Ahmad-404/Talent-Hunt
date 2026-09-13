'use client';

import { useState } from 'react';
import { clientApiFetch, readApiError } from '@/lib/api';

type ScreeningQuestion = {
  text: string;
  type: 'text' | 'boolean' | 'url';
  required: boolean;
};

export default function JobApplicationActions({
  jobId,
  questions,
}: {
  jobId: string;
  questions: ScreeningQuestion[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [answers, setAnswers] = useState<string[]>(
    questions.map(() => ''),
  );

  function updateAnswer(index: number, value: string) {
    setAnswers((current) =>
      current.map((answer, i) => (i === index ? value : answer)),
    );

    setMessage(null);
  }

  const requiredQuestionsAnswered = questions.every(
    (question, index) =>
      !question.required || answers[index].trim().length > 0,
  );

  async function apply() {
    if (!requiredQuestionsAnswered) {
      setMessage('Please answer all required questions.');
      return;
    }

    setBusy(true);
    setMessage(null);

    const response = await clientApiFetch('/api/applicants/apply', {
      method: 'POST',
      body: JSON.stringify({
        jobIds: [jobId],
        answers: {
          [jobId]: questions.map((question, index) => ({
            question: question.text,
            answer: answers[index],
          })),
        },
      }),
    });

    setMessage(
      response.ok
        ? 'Application submitted.'
        : await readApiError(response),
    );

    setBusy(false);
  }

  async function shortlist() {
    setBusy(true);
    setMessage(null);

    const response = await clientApiFetch('/api/applicants/shortlist', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });

    setMessage(
      response.ok
        ? 'Added to your shortlist.'
        : await readApiError(response),
    );

    setBusy(false);
  }

  return (
    <div className="space-y-5">
      {questions.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Application questions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Answer the questions below before submitting your application.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={`${question.text}-${index}`}>
                <label
                  htmlFor={`question-${index}`}
                  className="block text-sm font-medium text-slate-800"
                >
                  {question.text}
                  {question.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                {question.type === 'boolean' ? (
                  <select
                    id={`question-${index}`}
                    value={answers[index]}
                    onChange={(event) =>
                      updateAnswer(index, event.target.value)
                    }
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Choose an answer</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    id={`question-${index}`}
                    type={question.type === 'url' ? 'url' : 'text'}
                    value={answers[index]}
                    onChange={(event) =>
                      updateAnswer(index, event.target.value)
                    }
                    placeholder={
                      question.type === 'url'
                        ? 'https://example.com'
                        : 'Your answer'
                    }
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={apply}
          disabled={busy || !requiredQuestionsAnswered}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Submitting...' : 'Apply'}
        </button>

        <button
          type="button"
          onClick={shortlist}
          disabled={busy}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to shortlist
        </button>

        {message && (
          <p className="text-center text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}