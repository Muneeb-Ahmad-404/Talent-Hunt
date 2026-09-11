import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import JobActions from './JobActions';
import EditJobForm from './EditJobForm';
import { ErrorState } from '@/components/ui-states';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [response, user] = await Promise.all([apiFetch(`/api/jobs/${id}`), getCurrentUser()]);
  if (!response.ok) return <main className="p-6"><ErrorState message="Job not found." /></main>;
  const job = await response.json();
  const role = user?.memberships[0]?.companyRole;
  const canEdit = role === 'owner' || role === 'hr_manager' || role === 'recruiter';
  return <main className="mx-auto max-w-3xl space-y-6 p-6"><header><p className="text-sm text-gray-500">Company job</p><h1 className="text-3xl font-semibold">{job.title}</h1><span className="text-sm capitalize text-gray-500">{job.status}</span></header><p className="whitespace-pre-wrap text-gray-700">{job.description}</p>{canEdit && <><JobActions jobId={id} currentStatus={job.status} /><EditJobForm jobId={id} job={job} /></>}</main>;
}
