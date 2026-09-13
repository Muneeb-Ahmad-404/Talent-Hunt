import { getCurrentUser } from '@/lib/session';
import RecruiterPipeline from './RecruiterPipeline';
import { redirect } from 'next/navigation';
import { PageHeader, PageShell } from '@/components/ui';

export default async function ApplicationsPage() {

  return (
    <PageShell>
        <PageHeader
          eyebrow="Recruiting workspace"
          title="Application pipeline"
          description="Review candidates, move applications through the hiring process, and schedule the next conversation."
        />
        <RecruiterPipeline />
      </PageShell>
  )
}