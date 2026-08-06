import { NotFoundError, ConflictError, ForbiddenError } from '../../shared/errors';
import { sendVerificationEmail, sendInvitationEmail } from '../../shared/mailer';
import {
  getRecruiterCompany,
  getCompanyById,
  type Company,
  createCompany,
  createInvitation,
  findPendingInvitation,
  findExistingMember,
} from './companies.repo';
import type { CreateCompanyInput, InviteMemberInput } from './companies.schema';

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

export async function inviteMember(userId: string, input: InviteMemberInput) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, ['owner', 'hr_manager']);

  const existing = await findExistingMember(company.companyId, input.email);
  if (existing) throw new ConflictError('This person is already a member of your company.');

  const pending = await findPendingInvitation(company.companyId, input.email);
  if (pending) throw new ConflictError('A pending invitation for this email already exists.');

  const rawToken = await createInvitation(company.companyId, input.email, input.role);

  await sendInvitationEmail(input.email, rawToken);
}

function assertCompanyRole(companyRole: string, allowed: string[]) {
  if (!allowed.includes(companyRole)) {
    throw new ForbiddenError('You do not have permission to perform this action.');
  }
}