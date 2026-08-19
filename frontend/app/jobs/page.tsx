import { apiFetch } from '../../lib/api';
import Link from 'next/link';

type Job = { id: string; title: string; company: { name: string }; created_at: string };

export default async function JobsPage() {
  const res = await apiFetch('/api/public/jobs');
  const data: { jobs: any[] } = await res.json()

  return (
    <main>
      <h1>Open Positions</h1>
      <ul>
        {data.jobs.map((job) => (
          <li key={job.id}>
            <Link href={`/jobs/${job.id}`}>
              {job.title} — {job.companyName}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}