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
  updateMemberRole,
  getMemberById,
  listCompanyMembers,
  removeMember,
} from './companies.repo';
import type { CreateCompanyInput, InviteMemberInput, UpdateMemberInput } from './companies.schema';

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

export function assertCompanyRole(companyRole: string, allowed: string[]) {
  if (!allowed.includes(companyRole)) {
    throw new ForbiddenError('You do not have permission to perform this action.');
  }
}

export async function getMembers(userId: string) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  // owner and hr_manager can view the member list
  assertCompanyRole(company.companyRole, ['owner', 'hr_manager']);

  return listCompanyMembers(company.companyId);
}

export async function changeMemberRole(
  userId: string,
  recruiterId: string,
  input: UpdateMemberInput,
) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, ['owner']);

  const member = await getMemberById(recruiterId, company.companyId);
  if (!member) throw new NotFoundError('Member not found.');

  if (member.userId === userId) {
    throw new ForbiddenError('You cannot change your own role.');
  }

  if (member.companyRole === 'owner') {
    throw new ForbiddenError('The owner role cannot be changed via this endpoint.');
  }

  await updateMemberRole(recruiterId, company.companyId, input.role);
}

export async function deleteMember(userId: string, recruiterId: string) {
  const company = await getRecruiterCompany(userId);
  if (!company) throw new ForbiddenError('No company workspace found.');

  assertCompanyRole(company.companyRole, ['owner', 'hr_manager']);

  const member = await getMemberById(recruiterId, company.companyId);
  if (!member) throw new NotFoundError('Member not found.');

  if (member.userId === userId) {
    throw new ForbiddenError('You cannot remove yourself from the company.');
  }

  if(member.companyRole === "owner"){
    throw new ForbiddenError('You cannot remove the company owner');
  }

  await removeMember(recruiterId, company.companyId);
}