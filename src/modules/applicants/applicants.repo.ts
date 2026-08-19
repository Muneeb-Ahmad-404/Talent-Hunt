import { ZodAny, ZodError } from 'zod';
import { db } from '../../shared/db';
import { NotFoundError } from '../../shared/errors';
import { ValidationError } from '../../shared/validate';
import { ApplicationSnapshot } from './applicants.schema';
import { PoolClient } from 'pg';

export async function assertApplicantOwnership(
  applicantId: string,
  userId: string,
): Promise<void> {
  const result = await db.query<{ id: string; user_id: string }>(
    `SELECT id, user_id FROM applicants WHERE id = $1`,
    [applicantId],
  );

  if (result.rows.length === 0 || result.rows[0].user_id !== userId) {
    throw new NotFoundError('Applicant not found');
  }
}

export async function createApplicantProfile(
  userId: string,
  headline: string,
  bio: string,
  skills: string[]
) {
  const result = await db.query(
    `INSERT INTO applicants (user_id, headline, bio, skills)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, headline, bio, skills, created_at`,
    [userId, headline, bio, JSON.stringify(skills)]
  );
  return result.rows[0];
}

export async function findApplicantByUserId(userId: string) {
  const result = await db.query(
    `SELECT id, user_id, headline, bio, skills, created_at
     FROM applicants WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] ?? null;
}

export async function updateApplicantProfile(
  applicantId: string,
  fields: { headline?: string; bio?: string; skills?: string[] }
) {
  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (fields.headline !== undefined) {
    sets.push(`headline = $${i++}`);
    values.push(fields.headline);
  }
  if (fields.bio !== undefined) {
    sets.push(`bio = $${i++}`);
    values.push(fields.bio);
  }
  if (fields.skills !== undefined) {
    sets.push(`skills = $${i++}`);
    values.push(JSON.stringify(fields.skills));
  }

  if (sets.length === 0) return null;

  values.push(applicantId);
  const result = await db.query(
    `UPDATE applicants SET ${sets.join(', ')}
     WHERE id = $${i}
     RETURNING id, user_id, headline, bio, skills, created_at`,
    values
  );
  return result.rows[0] ?? null;
}

export async function createResume(
  applicantId: string,
  filename: string,
  s3Key: string
) {
  const result = await db.query(
    `INSERT INTO resumes (applicant_id, filename, s3_key)
     VALUES ($1, $2, $3)
     RETURNING id, applicant_id, filename, s3_key, uploaded_at`,
    [applicantId, filename, s3Key]
  );
  return result.rows[0];
}

export async function listResumes(applicantId: string) {
  const result = await db.query(
    `SELECT id, filename, s3_key, uploaded_at
     FROM resumes
     WHERE applicant_id = $1
     ORDER BY uploaded_at DESC`,
    [applicantId]
  );
  return result.rows;
}

export async function addToShortlist(applicantId: string, jobId: string) {
  // Verify job exists and is open
  const job = await db.query(
    `SELECT id FROM jobs WHERE id = $1 AND status = 'open'`,
    [jobId]
  );
  if (job.rowCount === 0) throw new NotFoundError('Job not found or not open');

  // Check limit
  const count = await db.query(
    `SELECT COUNT(*) FROM shortlist_items WHERE applicant_id = $1`,
    [applicantId]
  );
  if (parseInt(count.rows[0].count, 10) >= 100) {
    throw new ValidationError(
      new ZodError([
      {
        code: 'custom',
        path: ['limit'],
        message: 'Shortlist limit of 100 items reached',
      },
      ])
    );

  }

  const result = await db.query(
    `INSERT INTO shortlist_items (applicant_id, job_id)
     VALUES ($1, $2)
     RETURNING id, applicant_id, job_id, created_at`,
    [applicantId, jobId]
  );
  return result.rows[0];
}

export async function listShortlist(applicantId: string) {
  const result = await db.query(
    `SELECT
       si.id,
       si.job_id,
       si.created_at,
       j.title,
       j.status AS job_status,
       j.created_at AS job_created_at,
       c.id   AS company_id,
       c.name AS company_name
     FROM shortlist_items si
     JOIN jobs      j ON j.id = si.job_id
     JOIN companies c ON c.id = j.company_id
     WHERE si.applicant_id = $1
     ORDER BY si.created_at DESC
     LIMIT 100`,
    [applicantId]
  );
  return result.rows;
}

export async function removeFromShortlist(applicantId: string, jobId: string) {
  const result = await db.query(
    `DELETE FROM shortlist_items
     WHERE applicant_id = $1 AND job_id = $2
     RETURNING id`,
    [applicantId, jobId]
  );
  if (result.rowCount === 0) throw new NotFoundError('Shortlist item not found');
}

export async function checkExistingApplications(
  applicantId: string,
  jobIds: string[]
): Promise<string[]> {
  const result = await db.query(
    `SELECT job_id FROM applications
     WHERE applicant_id = $1 AND job_id = ANY($2::uuid[])`,
    [applicantId, jobIds]
  );
  return result.rows.map((r) => r.job_id);
}

export async function getExistingApplications(userId: string) {
  const applicantResult = await db.query(
    `SELECT id FROM applicants WHERE user_id = $1`,
    [userId]
  );

  if (applicantResult.rows.length === 0) {
    return [];
  }

  const applicantId = applicantResult.rows[0].id;

  const result = await db.query(
    `SELECT a.id, a.stage, j.title AS job_title, c.name AS company_name
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN companies c ON c.id = j.company_id
     WHERE a.applicant_id = $1
     ORDER BY a.created_at DESC`,
    [applicantId]
  );

  return result.rows;
}

// applicants.repo.ts — update insertApplication
export async function insertApplication(
  client: PoolClient,
  applicantId: string,
  jobId: string,
  answers: unknown,
  snapshot: unknown,
) {
  const result = await client.query(
    `INSERT INTO applications (job_id, applicant_id, screening_answers, profile_snapshot)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (job_id, applicant_id) DO NOTHING
     RETURNING id`,
    [jobId, applicantId, JSON.stringify(answers), JSON.stringify(snapshot)]
  );

  if (result.rows[0]) {
    return { id: result.rows[0].id, created: true };
  }

  const existing = await client.query(
    `SELECT id FROM applications WHERE job_id = $1 AND applicant_id = $2`,
    [jobId, applicantId]
  );
  return { id: existing.rows[0].id, created: false };
}

export async function getOpenJobs(jobIds: string[]): Promise<{ id: string }[]> {
  const result = await db.query(
    `SELECT id FROM jobs WHERE id = ANY($1::uuid[]) AND status = 'open'`,
    [jobIds]
  );
  return result.rows;
}

export async function buildApplicantSnapshot(applicantId: string): Promise<ApplicationSnapshot> {
  const profileResult = await db.query(
    `SELECT headline, bio, skills FROM applicants WHERE id = $1`,
    [applicantId]
  );
  const profile = profileResult.rows[0];
  if (!profile) throw new NotFoundError('Applicant profile not found');

  const resumeResult = await db.query(
    `SELECT s3_key FROM resumes
     WHERE applicant_id = $1
     ORDER BY uploaded_at DESC
     LIMIT 1`,
    [applicantId]
  );
  const resumeKey = resumeResult.rows[0]?.s3_key ?? null;

  return {
    headline:  profile.headline ?? null,
    bio:       profile.bio ?? null,
    skills:    profile.skills ?? [],
    resumeKey,
  };
}