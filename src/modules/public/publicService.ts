import { decodeCursor, encodeCursor } from '../../shared/cursor';
import { db } from '../../shared/db';
import { NotFoundError } from '../../shared/errors';



interface PublicJobsQuery {
  q?:               string;
  location?:        string;
  employment_type?: string;
  cursor?:          string;
  limit:            number;
}

export async function getPublicJobs(query: PublicJobsQuery) {
  const { q, location, employment_type, cursor, limit } = query;
  const params: unknown[] = [];
  const conditions: string[] = [
    `j.status = 'open'`,
    `c.status = 'verified'`,
  ];

  // Full-text search using tsvector + GIN index (replaces ILIKE from ch39)
  if (q) {
    params.push(q);
    conditions.push(
      `j.search_vector @@ plainto_tsquery('english', $${params.length})`
    );
  }

  if (location) {
    params.push(location);
    conditions.push(`j.location ILIKE $${params.length}`);
  }

  if (employment_type) {
    params.push(employment_type);
    conditions.push(`j.employment_type = $${params.length}`);
  }

  const decoded = cursor ? decodeCursor(cursor) : null;
  if (decoded) {
    params.push(decoded.createdAt, decoded.id);
    conditions.push(
      `(j.created_at, j.id) < ($${params.length - 1}::timestamptz, $${params.length})`
    );
  }

  const whereClause = conditions.join(' AND ');
  params.push(limit + 1);
  const limitParam = params.length;

  const sql = `
    SELECT
      j.id,
      j.title,
      j.location,
      j.employment_type,
      j.salary_min,
      j.salary_max,
      j.created_at,
      c.name AS company_name
    FROM jobs j
    JOIN companies c ON c.id = j.company_id
    WHERE ${whereClause}
    ORDER BY j.created_at DESC, j.id DESC
    LIMIT $${limitParam}
  `;

  const { rows } = await db.query(sql, params);

  const hasNextPage = rows.length > limit;
  const jobs = hasNextPage ? rows.slice(0, limit) : rows;

  const nextCursor =
    hasNextPage
      ? encodeCursor(jobs[jobs.length - 1].created_at, jobs[jobs.length - 1].id)
      : null;

  return {
    jobs: jobs.map((r) => ({
      id:             r.id,
      title:          r.title,
      companyName:    r.company_name,
      location:       r.location,
      employmentType: r.employment_type,
      salaryMin:      r.salary_min,
      salaryMax:      r.salary_max,
      createdAt:      r.created_at,
    })),
    nextCursor,
  };
}