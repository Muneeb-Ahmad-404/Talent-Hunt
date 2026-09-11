import { apiFetch } from '@/lib/server-api';
import { ErrorState } from '@/components/ui-states';
import Link from 'next/link';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';

const workspaceItems = [
  {
    title: 'Jobs',
    description: 'Create, publish, edit, and manage your open positions.',
    href: '/dashboard/jobs',
    action: 'Manage jobs',
    label: 'Hiring',
  },
  {
    title: 'Applications',
    description: 'Review candidates, evaluate applications, and move people through your pipeline.',
    href: '/dashboard/applications',
    action: 'Open pipeline',
    label: 'Candidates',
  },
  {
    title: 'Members',
    description: 'Manage your recruiting team, invitations, and company roles.',
    href: '/dashboard/members',
    action: 'View team',
    label: 'Team',
  },
];

export default async function CompanyPage() {
  const response = await apiFetch('/api/companies/me');

  if (!response.ok) {
    return (
      <main className="p-6">
        <ErrorState message="Unable to load the company workspace." />
      </main>
    );
  }

  const company: {
    id: string;
    name: string;
    status: string;
  } = await response.json();

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Company workspace"
          title={company.name}
          description="Manage your hiring workflow, recruiting team, and candidate pipeline."
          action={<StatusPill status={company.status} />}
        />

        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Workspace
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose an area to continue managing your company.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workspaceItems.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="flex h-full flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
                      {item.title.charAt(0)}
                    </div>

                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {item.label}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-7">
                    <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                      {item.action}
                      <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}