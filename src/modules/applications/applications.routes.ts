import { Router } from 'express';
import { authMiddleware as requireAuth } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';
import * as service from './applications.service';

const router = Router();
router.use(requireAuth, requireRole('recruiter'));

router.patch('/:id/stage', async (req, res, next) => {
  try { 
    const { stage } = req.body;
    const updated = await service.moveApplicationStage(
      req.user?.userId || "",
      req.params.id,
      stage
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export { router as applicationsRouter };