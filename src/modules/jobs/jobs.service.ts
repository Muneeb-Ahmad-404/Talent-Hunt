import { encodeCursor } from '../../shared/cursor';
import { ForbiddenError, NotFoundError } from '../../shared/errors';
import logger from '../../shared/logger';
import { redis } from '../../shared/redis';
import { getRecruiterCompany } from '../companies/companies.repo';
import { assertCompanyRole } from '../companies/companies.service';
import { assertJobOwnership, createJob, updateJob, setJobStatus, listJobsForCompany, getJob } from './jobs.repo';
import type { CreateJobInput, ListCompanyJobsInput } from './jobs.schema';

const PUBLIC_BOARD_CACHE_KEY = 'jobs:public:page1';

const JOB_POSTERS = ['owner', 'hr_manager', 'recruiter'] as const;

export async function postJob(userId: string, input: CreateJobInput) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, [...JOB_POSTERS]);

  const jobId = await createJob(company.companyId, input);
  return { jobId };
}

export async function editJob(
  userId: string,
  jobId: string,
  input: Partial<CreateJobInput>,
) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, [...JOB_POSTERS]);

  // Confirm the job belongs to this company (throws NotFoundError if not)
  await assertJobOwnership(jobId, company.companyId);

  await updateJob(jobId, company.companyId, input);
}

export async function publishJob(userId: string, jobId: string) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, [...JOB_POSTERS]);

  await assertJobOwnership(jobId, company.companyId);
  await setJobStatus(jobId, company.companyId, 'open');
  // TODO (ch59): invalidate 'jobs:public:page1' when company status changes.
  // Company verification/suspension changes which jobs appear on the public board.
  try {
    await redis.del(PUBLIC_BOARD_CACHE_KEY);
  } catch (err) {
    logger.error(err, '[cache] Failed to invalidate public board cache:');
  }
}

export async function closeJob(userId: string, jobId: string) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, [...JOB_POSTERS]);

  await assertJobOwnership(jobId, company.companyId);
  await setJobStatus(jobId, company.companyId, 'closed');

  try {
    await redis.del(PUBLIC_BOARD_CACHE_KEY);
  } catch (err) {
    logger.error(err, '[cache] Failed to invalidate public board cache:');
  }
}

export async function getCompanyJobs(userId: string, input: ListCompanyJobsInput) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  const rows = await listJobsForCompany(company.companyId, input);

  const hasNextPage = rows.length > input.limit;
  const items = hasNextPage ? rows.slice(0, input.limit) : rows;

  const nextCursor =
    hasNextPage && items.length > 0
      ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].id)
      : null;

  return { jobs: items, nextCursor };
}

export async function getJobDetails(jobId: string, companyId: string) {

  await assertJobOwnership(jobId, companyId);
  
  const job = await getJob(jobId, companyId);

  return job;
}