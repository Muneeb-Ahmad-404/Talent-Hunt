import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { config } from '../src/shared/config';

const client = new Client({ connectionString: config.DATABASE_URL });

async function seed() {
  await client.connect();

  try {
    await client.query('BEGIN');

    // ── Truncate all tables (respecting FK dependencies) ────────
    await client.query(`
      TRUNCATE 
        interviews,
        shortlist_items,
        resumes,
        applications,
        jobs,
        invitations,
        admins,
        recruiters,
        applicants,
        email_verifications,
        refresh_tokens,
        companies,
        users
      RESTART IDENTITY CASCADE
    `);

    const hash = await bcrypt.hash('password123', 10);

    // ── Users (no full_name in your schema) ──────────────────
    const { rows: [adminUser] } = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ('admin@portal.dev', $1, 'admin', 'active') RETURNING id`,
      [hash],
    );

    const { rows: [aliceUser] } = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ('alice@brightbuild.dev', $1, 'recruiter', 'active') RETURNING id`,
      [hash],
    );

    const { rows: [carlosUser] } = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ('carlos@novaspark.dev', $1, 'recruiter', 'active') RETURNING id`,
      [hash],
    );

    const { rows: [jamieUser] } = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ('jamie@example.dev', $1, 'applicant', 'active') RETURNING id`,
      [hash],
    );

    const { rows: [patUser] } = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ('pat@example.dev', $1, 'applicant', 'active') RETURNING id`,
      [hash],
    );

    const { rows: [morganUser] } = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ('morgan@example.dev', $1, 'applicant', 'active') RETURNING id`,
      [hash],
    );

    // ── Admin ──────────────────────────────────────────────────
    await client.query(
      `INSERT INTO admins (user_id) VALUES ($1)`,
      [adminUser.id],
    );

    // ── Companies (uses `status` not `verified`) ──────────────
    const { rows: [brightbuild] } = await client.query<{ id: string }>(`
      INSERT INTO companies (name, slug, website, status)
      VALUES ('BrightBuild', 'brightbuild', 'https://brightbuild.dev', 'verified')
      RETURNING id
    `);

    const { rows: [novaspark] } = await client.query<{ id: string }>(`
      INSERT INTO companies (name, slug, website, status)
      VALUES ('NovaSpark', 'novaspark', 'https://novaspark.dev', 'verified')
      RETURNING id
    `);

    // ── Recruiters ─────────────────────────────────────────────
    await client.query(
      `INSERT INTO recruiters (user_id, company_id, company_role)
       VALUES ($1, $2, 'owner')`,
      [aliceUser.id, brightbuild.id],
    );

    await client.query(
      `INSERT INTO recruiters (user_id, company_id, company_role)
       VALUES ($1, $2, 'owner')`,
      [carlosUser.id, novaspark.id],
    );

    // ── Applicants (no full_name; has headline, bio, skills) ───
    const { rows: [jamie] } = await client.query<{ id: string }>(
      `INSERT INTO applicants (user_id, headline, bio, skills, location)
       VALUES ($1, 'Backend engineer, 4 years experience', 'Passionate about APIs and databases.', $2, 'Remote')
       RETURNING id`,
      [jamieUser.id, JSON.stringify(['Node.js', 'PostgreSQL', 'Redis'])],
    );

    const { rows: [pat] } = await client.query<{ id: string }>(
      `INSERT INTO applicants (user_id, headline, bio, skills, location)
       VALUES ($1, 'Full-stack developer', 'Building web apps end-to-end.', $2, 'New York')
       RETURNING id`,
      [patUser.id, JSON.stringify(['React', 'TypeScript', 'Node.js'])],
    );

    const { rows: [morgan] } = await client.query<{ id: string }>(
      `INSERT INTO applicants (user_id, headline, bio, skills, location)
       VALUES ($1, 'UI/UX designer, product thinker', 'Designing user-centric experiences.', $2, 'San Francisco')
       RETURNING id`,
      [morganUser.id, JSON.stringify(['Figma', 'UI Design', 'UX Research'])],
    );

    // ── Resumes ────────────────────────────────────────────────
    await client.query(
      `INSERT INTO resumes (applicant_id, filename, s3_key, word_count)
       VALUES ($1, 'jamie_resume.pdf', 'resumes/jamie/resume.pdf', 450)`,
      [jamie.id],
    );

    await client.query(
      `INSERT INTO resumes (applicant_id, filename, s3_key, word_count)
       VALUES ($1, 'pat_resume.pdf', 'resumes/pat/resume.pdf', 320)`,
      [pat.id],
    );

    await client.query(
      `INSERT INTO resumes (applicant_id, filename, s3_key, word_count)
       VALUES ($1, 'morgan_resume.pdf', 'resumes/morgan/resume.pdf', 280)`,
      [morgan.id],
    );

    // ── Jobs ───────────────────────────────────────────────────
    const { rows: [backendJob] } = await client.query<{ id: string }>(
      `INSERT INTO jobs (company_id, title, description, status, location, employment_type, salary_min, salary_max)
       VALUES ($1, 'Backend Engineer', 'Build and maintain the core API and data layer.', 'open', 'Remote', 'full_time', 100000, 150000)
       RETURNING id`,
      [brightbuild.id],
    );

    const { rows: [productDesignerJob] } = await client.query<{ id: string }>(
      `INSERT INTO jobs (company_id, title, description, status, location, employment_type)
       VALUES ($1, 'Product Designer', 'Lead design for the web platform.', 'open', 'New York', 'full_time')
       RETURNING id`,
      [brightbuild.id],
    );

    const { rows: [uiJob] } = await client.query<{ id: string }>(
      `INSERT INTO jobs (company_id, title, description, status, location, employment_type)
       VALUES ($1, 'UI Designer', 'Shape the visual identity of client-facing products.', 'open', 'San Francisco', 'full_time')
       RETURNING id`,
      [novaspark.id],
    );

    await client.query(
      `INSERT INTO jobs (company_id, title, description, status, location, employment_type)
       VALUES ($1, 'Senior Frontend Engineer', 'Own the component library and performance budget.', 'draft', 'Remote', 'full_time')`,
      [novaspark.id],
    );

    // ── Applications ───────────────────────────────────────────
    const { rows: [app1] } = await client.query<{ id: string }>(
      `INSERT INTO applications (job_id, applicant_id, stage, status)
       VALUES ($1, $2, 'screening', 'active')
       RETURNING id`,
      [backendJob.id, jamie.id],
    );

    const { rows: [app2] } = await client.query<{ id: string }>(
      `INSERT INTO applications (job_id, applicant_id, stage, status)
       VALUES ($1, $2, 'interview', 'active')
       RETURNING id`,
      [uiJob.id, jamie.id],
    );

    const { rows: [app3] } = await client.query<{ id: string }>(
      `INSERT INTO applications (job_id, applicant_id, stage, status)
       VALUES ($1, $2, 'applied', 'active')
       RETURNING id`,
      [backendJob.id, pat.id],
    );

    const { rows: [app4] } = await client.query<{ id: string }>(
      `INSERT INTO applications (job_id, applicant_id, stage, status)
       VALUES ($1, $2, 'applied', 'active')
       RETURNING id`,
      [uiJob.id, morgan.id],
    );

    // ── Shortlist Items ────────────────────────────────────────
    await client.query(
      `INSERT INTO shortlist_items (applicant_id, job_id)
       VALUES ($1, $2)`,
      [jamie.id, productDesignerJob.id],
    );

    await client.query(
      `INSERT INTO shortlist_items (applicant_id, job_id)
       VALUES ($1, $2)`,
      [pat.id, uiJob.id],
    );

    // ── Interviews ─────────────────────────────────────────────
    await client.query(
      `INSERT INTO interviews (application_id, scheduled_at, meeting_link, notes, outcome)
       VALUES ($1, NOW() + INTERVAL '3 days', 'https://meet.example.com/interview-1', 'Technical interview', 'pending')`,
      [app2.id],
    );

    await client.query(
      `INSERT INTO interviews (application_id, scheduled_at, meeting_link, notes, outcome)
       VALUES ($1, NOW() - INTERVAL '2 days', 'https://meet.example.com/interview-2', 'Screening call', 'moved_forward')`,
      [app1.id],
    );

    // ── Refresh Tokens ─────────────────────────────────────────
    await client.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, 'test_refresh_token_hash_alice', NOW() + INTERVAL '7 days')`,
      [aliceUser.id],
    );

    await client.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, 'test_refresh_token_hash_jamie', NOW() + INTERVAL '7 days')`,
      [jamieUser.id],
    );

    // ── Email Verifications (uses `otp_hash` in your schema) ───
    await client.query(
      `INSERT INTO email_verifications (user_id, otp_hash, expires_at)
       VALUES ($1, 'test_otp_hash_123456', NOW() + INTERVAL '15 minutes')`,
      [patUser.id],
    );

    await client.query('COMMIT');
    console.log('✅ Seed complete.');

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});