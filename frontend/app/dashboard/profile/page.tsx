import { apiFetch } from '@/lib/server-api';
import ProfileEditor from './ProfileEditor';
import ResumeUpload from './ResumeUpload';
import { ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card } from '@/components/ui';

export default async function ProfilePage() {
  const response = await apiFetch('/api/applicants/profile');

  if (!response.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Applicant profile"
          title="Your profile"
          description="Keep your professional information current so every new application starts from the right details."
        />
        <ErrorState message="Unable to load your profile." />
      </PageShell>
    );
  }

  const profile = await response.json();

  return (
    <PageShell className="max-w-4xl">
      <PageHeader
        eyebrow="Applicant profile"
        title="Your profile"
        description="Manage the professional information used when you apply for opportunities."
      />

      <div className="space-y-6">
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Professional information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep your headline, bio, and skills up to date.
            </p>
          </div>

          <ProfileEditor profile={profile} />
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Resume
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a PDF resume to include it with future applications.
            </p>
          </div>

          <Card className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  Your current resume
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep a recent version ready before applying to a new
                  opportunity.
                </p>
              </div>

              <div className="shrink-0">
                <ResumeUpload />
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}