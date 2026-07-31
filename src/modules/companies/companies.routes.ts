import { Router } from 'express';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';
import { getMyCompany } from './companies.service';

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

export { router as companiesRouter };