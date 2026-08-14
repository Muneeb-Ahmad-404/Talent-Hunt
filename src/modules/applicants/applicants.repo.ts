import { db } from '../../shared/db';
import { NotFoundError } from '../../shared/errors';

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