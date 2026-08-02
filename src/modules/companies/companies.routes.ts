import { Router } from 'express';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';
import { getMyCompany, openWorkspace } from './companies.service';
import { validateBody } from '../../shared/validate';
import { createCompanySchema } from './companies.schema';


const router = Router();

router.use(authMiddleware, requireRole('recruiter'));

router.get('/', (_req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

router.get('/me', async (req, res, next) => {
  try {
    const company = await getMyCompany(req.user!.userId);
    res.json(company);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const input = validateBody(createCompanySchema, req.body);
    const result = await openWorkspace(req.user!.userId, input);
    res.status(201).json({
      companyId: result.companyId,
      name: result.name,
      status: 'pending',
    });
  } catch (err) {
    next(err);
  }
});

export { router as companiesRouter };