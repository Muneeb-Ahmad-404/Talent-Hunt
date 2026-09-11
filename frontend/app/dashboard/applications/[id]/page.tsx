import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import type { Pipeline } from '@/lib/types';
import ApplicationActions from '../ApplicationActions';
import { ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card } from '@/components/ui';

export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user?.role === 'applicant') {
    const response = await apiFetch('/api/applicants/applications');
    if (!response.ok) return <PageShell><ErrorState message="Unable to load this application." /></PageShell>;
    const { applications }: { applications: Array<{ id: string; job_title: string; company_name: string; stage: string; created_at?: string; profile_snapshot?: { headline?: string | null; bio?: string | null; skills?: string[]; resumeKey?: string | null }; screening_answers?: unknown[] }> } = await response.json();
    const application = applications.find((item) => item.id === id);
    if (!application) notFound();
    return <PageShell className="max-w-4xl"><PageHeader eyebrow="Application history" title={application.job_title} description={`${application.company_name} · Submitted application`} /><div className="space-y-5"><Card className="p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Current stage</h2><span className="capitalize text-slate-600">{application.stage.replace('_', ' ')}</span></div>{application.created_at && <p className="mt-2 text-sm text-slate-500">Submitted {new Date(application.created_at).toLocaleDateString()}</p>}</Card><Card className="p-6"><h2 className="font-semibold">Application snapshot</h2><p className="mt-1 text-sm text-slate-500">This is the information saved with your application at submission time.</p>{application.profile_snapshot ? <div className="mt-5 space-y-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Headline</p><p className="mt-1 text-slate-800">{application.profile_snapshot.headline || 'Not provided'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bio</p><p className="mt-1 whitespace-pre-wrap text-slate-800">{application.profile_snapshot.bio || 'Not provided'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skills</p><p className="mt-1 text-slate-800">{application.profile_snapshot.skills?.join(', ') || 'Not provided'}</p></div></div> : <p className="mt-5 text-sm text-slate-500">The existing application list does not include the saved profile snapshot.</p>}</Card><Card className="p-6"><h2 className="font-semibold">Screening answers</h2><p className="mt-2 text-sm text-slate-500">{application.screening_answers ? 'Submitted answers are shown below.' : 'Screening answers are not included in the existing applicant application response.'}</p>{application.screening_answers && <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">{JSON.stringify(application.screening_answers, null, 2)}</pre>}</Card></div></PageShell>;
  }
  const response = await apiFetch('/api/applications');
  if (!response.ok) return <main className="p-6"><ErrorState message="Unable to load this application." /></main>;
  const { pipeline }: { pipeline: Pipeline } = await response.json();
  const application = Object.values(pipeline).flat().find((item) => item.id === id);
  if (!application) notFound();
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div><p className="text-sm text-gray-500">Application review</p><h1 className="text-3xl font-semibold">{application.job_title}</h1><p className="text-gray-600">{application.profile_snapshot?.headline ?? 'Applicant'}</p></div>
      <section className="rounded-xl border p-5"><h2 className="font-semibold">Saved application profile</h2><p className="mt-3 whitespace-pre-wrap text-gray-700">{application.profile_snapshot?.bio || 'No saved bio provided.'}</p><div className="mt-4 flex flex-wrap gap-2">{(application.profile_snapshot?.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-sm">{skill}</span>)}</div></section>
      <section className="rounded-xl border p-5"><h2 className="font-semibold">Screening answers</h2><p className="mt-2 text-sm text-gray-500">Screening answers are not included in the current company pipeline response.</p></section>
      <ApplicationActions applicationId={application.id} currentStage={application.stage} interviewId={application.latest_interview?.id} />
    </main>
  );
}
