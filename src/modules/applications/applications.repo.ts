import { db } from "../../shared/db";

export async function findApplicationForCompany(
  applicationId: string,
  companyId: string
) {
  const result = await db.query(
    `SELECT a.id, a.job_id, a.applicant_id, a.stage, a.status
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id = $1 AND j.company_id = $2`,
    [applicationId, companyId]
  );
  return result.rows[0] ?? null;
}

export async function updateApplicationStage(
  applicationId: string,
  stage: string
) {
  const result = await db.query(
    `UPDATE applications SET stage = $1 WHERE id = $2
     RETURNING id, job_id, applicant_id, stage, status, created_at`,
    [stage, applicationId]
  );
  return result.rows[0] ?? null;
}

export async function recruiterCompanyId(userId: string){
    const member = await db.query(
    `SELECT company_id FROM recruiters WHERE user_id = $1`,
    [userId]
    );
    return member.rows[0].company_id ?? null;
}