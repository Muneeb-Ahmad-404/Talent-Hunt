import { db } from '../../shared/db';
import { sendRecruiterDigestEmail } from '../../shared/mailer';

interface CompanyDigest {
  companyId: string;
  companyName: string;
  ownerEmail: string;
  openJobsCount: number;
  applicationsLast7Days: number;
  interviewsThisWeek: number;
}

// Query aggregate data for all verified companies
async function fetchCompanyDigests(): Promise<CompanyDigest[]> {
  const result = await db.query(
    `SELECT
       c.id             AS "companyId",
       c.name           AS "companyName",
       u.email          AS "ownerEmail",
       (
         SELECT count(*)::int
         FROM jobs j
         WHERE j.company_id = c.id AND j.status = 'open'
       ) AS "openJobsCount",
       (
         SELECT count(*)::int
         FROM applications a
         JOIN jobs j ON j.id = a.job_id
         WHERE j.company_id = c.id
           AND a.created_at >= NOW() - INTERVAL '7 days'
       ) AS "applicationsLast7Days",
       (
         SELECT count(*)::int
         FROM interviews iv
         JOIN applications a ON a.id = iv.application_id
         JOIN jobs j ON j.id = a.job_id
         WHERE j.company_id = c.id
           AND iv.scheduled_at >= date_trunc('week', NOW())
           AND iv.scheduled_at <  date_trunc('week', NOW()) + INTERVAL '7 days'
       ) AS "interviewsThisWeek"
     FROM companies c
     JOIN recruiters r on r.company_id = c.id
     JOIN users u on u.id = r.user_id
     WHERE c.status = 'verified'`,
    []
  );
  return result.rows;
}

// Send a digest email to each verified company owner
export async function sendRecruiterDigest(): Promise<void> {
  const digests = await fetchCompanyDigests();

  for (const digest of digests) {
    await sendRecruiterDigestEmail(
      digest.ownerEmail,
      digest.companyName,
      digest.openJobsCount,
      digest.applicationsLast7Days,
      digest.interviewsThisWeek
    );
  }

  console.log(`[digest] Sent digest emails to ${digests.length} companies`);
}