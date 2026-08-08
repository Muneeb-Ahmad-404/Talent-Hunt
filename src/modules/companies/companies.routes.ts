import { Router } from 'express';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';
import { getMyCompany, openWorkspace, inviteMember, getMembers, changeMemberRole, deleteMember } from './companies.service';
import { validateBody } from '../../shared/validate';
import { createCompanySchema, inviteMemberSchema, updateMemberSchema } from './companies.schema';


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

router.post('/invitations', async (req, res, next) => {
  try {
    const input = validateBody(inviteMemberSchema, req.body);
    await inviteMember(req.user!.userId, input);
    res.status(201).json({ message: 'Invitation sent.' });
  } catch (err) {
    next(err);
  }
});

router.get('/members', async (req, res, next) => {
  try {
    const members = await getMembers(req.user!.userId);
    res.json({ members });
  } catch (err) {
    next(err);
  }
});

router.patch('/members/:recruiterId', async (req, res, next) => {
  try {
    const input = validateBody(updateMemberSchema, req.body);
    await changeMemberRole(req.user!.userId, req.params.recruiterId, input);
    res.json({ message: 'Role updated.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/members/:recruiterId', async (req, res, next) => {
  try {
    await deleteMember(req.user!.userId, req.params.recruiterId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export { router as companiesRouter };