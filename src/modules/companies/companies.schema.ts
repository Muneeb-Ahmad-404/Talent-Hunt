import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2).max(100),
  website: z.url().optional(),
  slug: z.string().max(100),
});

export const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(['hr_manager', 'recruiter', 'hiring_manager']),
});

export const updateMemberSchema = z.object({
  role: z.enum(['hr_manager', 'recruiter', 'hiring_manager']),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;