import { Router } from 'express';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';
import * as service from './applicants.service';

const router = Router();
router.use(authMiddleware, requireRole('applicant'));

router.post('/profile', async (req, res, next) => {
  try {
    const { headline, bio, skills } = req.body;
    const profile = await service.createProfile(req.user!.userId, { headline, bio, skills });
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
});

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await service.getProfile(req.user!.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', async (req, res, next) => {
  try {
    const { headline, bio, skills } = req.body;
    const profile = await service.updateProfile(req.user!.userId, { headline, bio, skills });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

export default router;router.get('/', (_req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

export { router as applicantsRouter };