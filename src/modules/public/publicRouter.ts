import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateQuery } from '../../shared/validate';
import { getPublicJobs, getPublicJobById } from './publicService';

export const publicRouter = Router();

const listQuerySchema = z.object({
  q:               z.string().optional(),
  location:        z.string().optional(),
  employment_type: z
    .enum(['full_time', 'part_time', 'contract', 'internship'])
    .optional(),
  cursor: z.string().optional(),
  limit:  z.coerce.number().int().min(1).max(100).default(20),
});

publicRouter.get('/jobs', async (req: Request, res: Response) => {
  const data = validateQuery(listQuerySchema, req.query)
  const result = await getPublicJobs(data);
  res.json(result);
});

publicRouter.get('/jobs/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const job = await getPublicJobById(id);
  res.json(job);
});