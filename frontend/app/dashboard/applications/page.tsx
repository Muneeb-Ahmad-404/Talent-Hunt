import { getCurrentUser } from '@/lib/session';
import RecruiterPipeline from './RecruiterPipeline';
import ApplicantApplications from './ApplicantApplications';
import { redirect } from 'next/navigation';
import { PageHeader, PageShell } from '@/components/ui';

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user.role === 'recruiter' ? <PageShell><PageHeader eyebrow="Recruiting workspace" title="Application pipeline" description="Review candidates, keep decisions moving, and schedule the next conversation." /><RecruiterPipeline /></PageShell> : <ApplicantApplications />;
}
