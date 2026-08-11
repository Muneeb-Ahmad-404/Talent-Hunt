import { db } from '../../shared/db';
import { NotFoundError } from '../../shared/errors';
import { v4 as uuid } from 'uuid';
import { CreateJobInput, ListCompanyJobsInput } from './jobs.schema';
import { decodeCursor } from '../../shared/cursor';

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

export async function createJob(
  companyId: string,
  input: CreateJobInput,
): Promise<string> {
  const jobId = uuid();
  await db.query(
    `INSERT INTO jobs
       (id, company_id, title, description, location, employment_type,
        status, salary_min, salary_max, attributes, screening_questions, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'draft', $7, $8, $9, $10, NOW())`,
    [
      jobId,
      companyId,
      input.title,
      input.description ?? null,
      input.location ?? null,
      input.employment_type ?? null,
      input.salary_min ?? null,
      input.salary_max ?? null,
      JSON.stringify(input.attributes ?? {}),
      JSON.stringify(input.screening_questions ?? []),
    ],
  );
  return jobId;
}

export async function updateJob(
  jobId: string,
  companyId: string,
  input: Partial<CreateJobInput>,
): Promise<void> {
  // Build a dynamic SET clause from provided fields
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const allowed = [
    'title', 'description', 'location', 'employment_type',
    'salary_min', 'salary_max', 'attributes', 'screening_questions',
  ] as const;

  for (const key of allowed) {
    if (key in input && input[key as keyof typeof input] !== undefined) {
      fields.push(`${key} = $${idx}`);
      const val = input[key as keyof typeof input];
      values.push(
        key === 'attributes' || key === 'screening_questions'
          ? JSON.stringify(val)
          : val,
      );
      idx++;
    }
  }

  if (fields.length === 0) return; // nothing to update

  values.push(jobId);
  values.push(companyId);
  await db.query(
    `UPDATE jobs SET ${fields.join(', ')}
     WHERE id = $${idx} AND company_id = $${idx + 1}`,
    values,
  );
}

export async function setJobStatus(
  jobId: string,
  companyId: string,
  status: 'open' | 'closed',
): Promise<void> {
  await db.query(
    `UPDATE jobs SET status = $1
     WHERE id = $2 AND company_id = $3`,
    [status, jobId, companyId],
  );
}

export async function listJobsForCompany(
  companyId: string,
  input: ListCompanyJobsInput,
): Promise<Array<{ id: string; title: string; status: string; createdAt: string }>> {
  const params: unknown[] = [companyId];
  const conditions: string[] = ['company_id = $1'];
  let idx = 2;

  if (input.status) {
    conditions.push(`status = $${idx}`);
    params.push(input.status);
    idx++;
  }

  if (input.cursor) {
    const decoded = decodeCursor(input.cursor);
    if (decoded) {
      conditions.push(`(created_at, id) < ($${idx}::timestamptz, $${idx + 1})`);
      params.push(decoded.createdAt, decoded.id);
      idx += 2;
    }
    // If cursor is malformed, ignore it and return from the start
  }

  params.push(input.limit + 1); // fetch one extra to detect if there is a next page

  const result = await db.query(
    `SELECT id, title, status, created_at AS "createdAt"
     FROM jobs
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC, id DESC
     LIMIT $${idx}`,
    params,
  );

  return result.rows;
}