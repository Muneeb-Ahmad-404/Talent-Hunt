import { apiFetch } from '@/lib/api-server';

const columns = ['applied', 'screening', 'interview', 'offer', 'hired'];
export default async function ApplicantsPage() {
  const response = await apiFetch('/api/applications');
  const payload = await response.json().catch(() => ({}));
  const pipeline = Array.isArray(payload) ? payload : Array.isArray(payload.pipeline) ? payload.pipeline : [];
  const groups = columns.map((stage) => ({ stage, items: pipeline.filter((item: any) => String(item.stage ?? 'applied') === stage) }));
  return <main className="mx-auto max-w-7xl px-6 py-8 md:px-10"><div className="mb-8"><p className="text-sm font-medium text-primary">Recruiter workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Hiring pipeline</h1><p className="mt-2 text-muted-foreground">Move candidates forward, schedule interviews, and keep your team aligned.</p></div><div className="grid gap-4 overflow-x-auto lg:grid-cols-5">{groups.map(({ stage, items }) => <section key={stage} className="min-w-[220px] rounded-xl bg-muted/40 p-3"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold capitalize">{stage}</h2><span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span></div><div className="flex flex-col gap-3">{items.map((item: any) => <article key={item.id} className="rounded-lg border bg-card p-4 shadow-sm"><p className="font-medium">{item.applicant_name ?? item.applicantName ?? 'Applicant'}</p><p className="mt-1 truncate text-xs text-muted-foreground">{item.job_title ?? item.jobTitle ?? 'Role'}</p><a href={`/dashboard/applicants/${item.id}`} className="mt-3 inline-block text-xs font-semibold text-primary">Open application →</a></article>)}{items.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No candidates</p>}</div></section>)}</div></main>;
}

export const dynamic = 'force-dynamic';
