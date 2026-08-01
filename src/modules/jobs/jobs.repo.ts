import { db } from '../../shared/db';
import { NotFoundError } from '../../shared/errors';

// ISOLATION RULE: Every company-scoped query must include company_id from
// the authenticated recruiter row (resolved via getRecruiterCompany), never
// from a URL parameter or request body. The recruiter cannot control which
// company_id is used to scope their queries.

export async function assertJobOwnership(
  jobId: string,
  companyId: string,
): Promise<void> {
  const result = await db.query<{ id: string; company_id: string }>(
    `SELECT id, company_id FROM jobs WHERE id = $1`,
    [jobId],
  );

  if (result.rows.length === 0 || result.rows[0].company_id !== companyId) {
    throw new NotFoundError('Job not found');
  }
}