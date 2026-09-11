import { apiFetch } from '@/lib/server-api';
import ProfileEditor from './ProfileEditor';
import ResumeUpload from './ResumeUpload';
import { ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card } from '@/components/ui';

export default async function ProfilePage() {
  const response = await apiFetch('/api/applicants/profile');
  if (!response.ok) return <main className="p-6"><ErrorState message="Unable to load your profile." /></main>;
  const profile = await response.json();
  return <PageShell className="max-w-4xl"><PageHeader eyebrow="Applicant profile" title="Your profile" description="Keep your professional story current for the opportunities you care about." /><div className="space-y-5"><ProfileEditor profile={profile} /><Card className="p-6"><h2 className="font-semibold text-slate-950">Resume</h2><p className="mt-1 text-sm text-slate-500">Upload a PDF resume to include it with future applications.</p><div className="mt-5"><ResumeUpload /></div></Card></div></PageShell>;
}
