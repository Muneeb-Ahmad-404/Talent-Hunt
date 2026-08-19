import { apiFetch } from '../../../lib/api';

const STAGE_COLOURS: Record<string, string> = {
  applied:         'bg-gray-200',
  screening:       'bg-blue-200',
  interview:       'bg-yellow-200',
  final_interview: 'bg-orange-200',
  offer:           'bg-green-200',
  hired:           'bg-green-500',
  rejected:        'bg-red-200',
};

export default async function ApplicationsPage() {
  const res = await apiFetch('/api/applicants/applications');
  const data: any[] = await res.json()

  return (
    <main>
      <h1>My Applications</h1>
      <ul>
        {data.map((app) => (
          <li key={app.id}>
            <span>{app.job_title} — {app.company_name}</span>
            <span className={`badge ${STAGE_COLOURS[app.stage] ?? ''}`}>{app.stage}</span>
            {/* TODO */}
            {/* {app.upcoming_interview && (
              <span>Interview: {new Date(app.upcoming_interview.scheduled_at).toLocaleString()}</span>
            )} */}
          </li>
        ))}
      </ul>
    </main>
  );
}