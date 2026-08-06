import { v4 as uuid } from 'uuid';
import { db } from '../../shared/db';
import type { CreateCompanyInput } from './companies.schema';
import crypto from 'crypto';
import { config } from '../../shared/config';

export interface RecruiterCompany {
  companyId: string;
  companyRole: string;
}

export interface Company {
  id: string;
  name: string;
  status: string;
}

// ISOLATION RULE: Every company-scoped query must include company_id from
// the authenticated recruiter row (resolved via getRecruiterCompany), never
// from a URL parameter or request body. The recruiter cannot control which
// company_id is used to scope their queries.

export async function getRecruiterCompany(
  userId: string,
): Promise<RecruiterCompany | null> {
  const result = await db.query<{ company_id: string; company_role: string }>(
    `SELECT r.company_id, r.company_role
     FROM recruiters r
     WHERE r.user_id = $1`,
    [userId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    companyId: result.rows[0].company_id,
    companyRole: result.rows[0].company_role,
  };
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  const result = await db.query<{ id: string; name: string; status: string }>(
    `SELECT id, name, verified
     FROM companies
     WHERE id = $1`,
    [companyId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export async function createCompany(
  userId: string,
  input: CreateCompanyInput,
): Promise<{ companyId: string; name: string }> {
  const companyId = uuid();
  const recruiterId = uuid();

  await db.query('BEGIN');
  try {
    await db.query(
      `INSERT INTO companies (id, name, website, slug, verified)
       VALUES ($1, $2, $3, $4, false)`,
      [companyId, input.name, input.website ?? null, input.slug ?? null],
    );
    await db.query(
      `INSERT INTO recruiters (id, user_id, company_id, company_role, created_at)
       VALUES ($1, $2, $3, 'owner', NOW())`,
      [recruiterId, userId, companyId],
    );
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }

  return { companyId, name: input.name };
}

export async function createInvitation(
  companyId: string,
  email: string,
  role: string,
): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const invitationId = uuid();

  await db.query(
    `INSERT INTO invitations (id, company_id, email, role, token_hash, expires_at, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW() + ($6 || ' hours')::interval, NOW())`,
    [
      invitationId,
      companyId,
      email,
      role,
      tokenHash,
      String(config.INVITATION_EXPIRES_IN_HOURS),
    ],
  );

  return rawToken; // raw token returned to the caller; only the hash is stored
}

export async function findPendingInvitation(
  companyId: string,
  email: string,
): Promise<{ id: string } | null> {
  const result = await db.query(
    `SELECT id FROM invitations
     WHERE company_id = $1 AND email = $2 AND expires_at > NOW()`,
    [companyId, email],
  );
  return result.rows[0] ?? null;
}

export async function findExistingMember(
  companyId: string,
  email: string,
): Promise<{ id: string } | null> {
  const result = await db.query(
    `SELECT r.id FROM recruiters r
     JOIN users u ON u.id = r.user_id
     WHERE r.company_id = $1 AND u.email = $2`,
    [companyId, email],
  );
  return result.rows[0] ?? null;
}