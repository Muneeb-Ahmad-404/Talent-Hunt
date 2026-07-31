import { Router } from 'express';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';

const router = Router();

router.use(authMiddleware, requireRole('recruiter'));

router.get('/', (_req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

export { router as companiesRouter };