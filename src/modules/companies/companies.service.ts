import { NotFoundError } from '../../shared/errors';
import {
  getRecruiterCompany,
  getCompanyById,
  type Company,
} from './companies.repo';

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