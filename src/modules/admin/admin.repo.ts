import { db } from '../../shared/db';

export async function listCompanies(status?: string) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    params.push(status);
    conditions.push(`c.status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await db.query(
    `SELECT c.id, c.name, c.status, c.created_at, u.email AS owner_email
     FROM companies c
     JOIN recruiters r ON r.company_id = c.id
     JOIN users u ON u.id = r.user_id
     ${where}
     ORDER BY c.created_at DESC`,
    params
  );
  return result.rows;
}

// Find a single company by id
export async function findCompanyById(id: string) {
  const result = await db.query(
    `SELECT id, name, status FROM companies WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

// Set company status and return updated row
export async function setCompanyStatus(id: string, status: string) {
  const result = await db.query(
    `UPDATE companies SET status = $1 WHERE id = $2
     RETURNING id, name, status`,
    [status, id]
  );
  return result.rows[0] ?? null;
}

// Close all open jobs for a company (called on suspension)
export async function closeOpenJobsForCompany(companyId: string) {
  await db.query(
    `UPDATE jobs SET status = 'closed'
     WHERE company_id = $1 AND status = 'open'`,
    [companyId]
  );
}