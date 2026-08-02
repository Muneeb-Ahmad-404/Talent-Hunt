import { NotFoundError, ConflictError } from '../../shared/errors';
import {
  getRecruiterCompany,
  getCompanyById,
  type Company,
  createCompany
} from './companies.repo';
import type { CreateCompanyInput } from './companies.schema';

export async function getMyCompany(userId: string): Promise<Company> {
  const recruiter = await getRecruiterCompany(userId);

  if (!recruiter) {
    throw new NotFoundError('No company associated with this account');
  }

  const company = await getCompanyById(recruiter.companyId);

  if (!company) {
        throw new NotFoundError('Company not found');
  }

  return company;
}

export async function openWorkspace(userId: string, input: CreateCompanyInput) {
  // Guard: a user can own at most one company
  const existing = await getRecruiterCompany(userId);
  if (existing) {
    throw new ConflictError('You already have a company workspace.');
  }

  return createCompany(userId, input);
}