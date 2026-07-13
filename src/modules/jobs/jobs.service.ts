import { NotFoundError, ForbiddenError } from '../../shared/errors';
import {jobsRepo} from './jobs.repo'

export async function getJob(jobId: string, requestingCompanyId: string) {
  const job = await jobsRepo.findById(jobId);
  if (!job) throw new NotFoundError('Job not found');
  if (job.companyId !== requestingCompanyId) throw new ForbiddenError('Access denied');
  return job;
}