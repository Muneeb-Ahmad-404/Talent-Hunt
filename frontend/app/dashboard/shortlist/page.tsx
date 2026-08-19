import { apiFetch } from '../../../lib/api';
import Link from 'next/link';

export default async function ShortlistPage() {
  const res = await apiFetch('/api/applicants/shortlist');
  const data: { shortlist: any[] } = await res.json();

  return (
    <main>
      <h1>My Shortlist</h1>
      <ul>
        {data.shortlist?.map((item) => (
          <li key={item.id}>
            <Link href={`/jobs/${item.job_id}`}>
              {item.title} — {item.company_name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}