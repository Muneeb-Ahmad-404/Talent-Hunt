import * as repo from './admin.repo';
import { redis } from '../../shared/redis';
import { NotFoundError, ConflictError } from '../../shared/errors';

export async function listCompanies(status?: string) {
  return repo.listCompanies(status);
}

export async function verifyCompany(id: string) {
  const company = await repo.findCompanyById(id);
  if (!company) throw new NotFoundError('Company not found');
  if (company.status === 'verified') throw new ConflictError('Company is already verified');

  const updated = await repo.setCompanyStatus(id, 'verified');
  return updated;
}

export async function suspendCompany(id: string) {
  const company = await repo.findCompanyById(id);
  if (!company) throw new NotFoundError('Company not found');
  if (company.status === 'suspended') throw new ConflictError('Company is already suspended');

  const updated = await repo.setCompanyStatus(id, 'suspended');

  await repo.closeOpenJobsForCompany(id);

  await redis.del('jobs:public:page1');

  return updated;
}