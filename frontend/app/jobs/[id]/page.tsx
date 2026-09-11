import { apiFetch } from '@/lib/server-api';
import type { Job } from '@/lib/types';
import JobApplicationActions from './JobApplicationActions';
import { ErrorState, NotFoundState } from '@/components/ui-states';

export default async function PublicJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await apiFetch(`/api/public/jobs/${id}`);
  if (response.status === 404) return <main className="p-6"><NotFoundState /></main>;
  if (!response.ok) return <main className="p-6"><ErrorState message="Unable to load this job." /></main>;
  const job: Job = await response.json();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <p className="text-sm text-gray-500">{job.companyName}</p>
        <h1 className="text-3xl font-semibold">{job.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{[job.location, job.employmentType?.replace('_', ' ')].filter(Boolean).join(' · ')}</p>
      </header>
      {job.description && <section><h2 className="font-semibold">About the role</h2><p className="mt-2 whitespace-pre-wrap text-gray-700">{job.description}</p></section>}
      {(job.salaryMin != null || job.salaryMax != null) && <p className="text-sm text-gray-700">Salary: {[job.salaryMin, job.salaryMax].filter((value) => value != null).join(' – ')}</p>}
      {job.attributes && Object.keys(job.attributes).length > 0 && <section><h2 className="font-semibold">Requirements</h2><pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(job.attributes, null, 2)}</pre></section>}
      {job.screeningQuestions && job.screeningQuestions.length > 0 && <section><h2 className="font-semibold">Application questions</h2><ul className="mt-2 list-disc pl-5 text-gray-700">{job.screeningQuestions.map((question) => <li key={question.text}>{question.text}{question.required ? ' *' : ''}</li>)}</ul></section>}
      <p className="text-sm text-gray-500">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
      <JobApplicationActions jobId={id} questions={job.screeningQuestions ?? []} />
    </main>
  );
}
