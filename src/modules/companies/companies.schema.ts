import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2).max(100),
  website: z.url().optional(),
  slug: z.string().max(100),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;