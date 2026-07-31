import { Router } from 'express';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';
import { getRecruiterCompany } from '../companies/companies.repo';
import { assertJobOwnership } from './jobs.repo';
import { NotFoundError } from '../../shared/errors';

const router = Router();

router.use(authMiddleware, requireRole('recruiter'));

router.get('/:id', async (req, res, next) => {
  try {
    const recruiter = await getRecruiterCompany(req.user!.userId);

    if (!recruiter) {
      return next(new NotFoundError('No company associated with this account'));
    }

    await assertJobOwnership(req.params.id, recruiter.companyId);
  
    res.json({ jobId: req.params.id, companyId: recruiter.companyId });
    
  } catch (err) {
    next(err);
  }
});

export { router as jobsRouter };