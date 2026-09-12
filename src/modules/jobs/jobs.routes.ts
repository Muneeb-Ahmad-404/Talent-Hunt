import { Router } from "express";
import { validateBody, validateQuery } from "../../shared/validate";
import { createJobSchema, listCompanyJobsSchema } from "./jobs.schema";
import { closeJob, editJob, getCompanyJobs, getJobDetails, postJob, publishJob } from "./jobs.service";
import { authMiddleware } from "../../shared/auth-middleware";
import { requireRole } from "../../shared/require-role";
import { getRecruiterCompany } from "../companies/companies.repo";
import { NotFoundError } from "../../shared/errors";
import { assertJobOwnership } from "./jobs.repo";

const router = Router()

router.use(authMiddleware, requireRole('recruiter'));

router.get('/:id', async (req, res, next) => {
  try {
    const recruiter = await getRecruiterCompany(req.user!.userId);

    if (!recruiter) {
      return next(new NotFoundError('No company associated with this account'));
    }
    
    const jobDetails = await getJobDetails(req.params.id, recruiter.companyId)

    res.json(jobDetails);
    
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const input = validateBody(createJobSchema, req.body);
    const result = await postJob(req.user!.userId, input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const input = validateBody(createJobSchema.partial(), req.body);
    await editJob(req.user!.userId, req.params.id, input);
    res.json({ message: 'Job updated.' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/publish', async (req, res, next) => {
  try {
    await publishJob(req.user!.userId, req.params.id);
    res.json({ message: 'Job published.' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/close', async (req, res, next) => {
  try {
    await closeJob(req.user!.userId, req.params.id);
    res.json({ message: 'Job closed.' });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const input = validateQuery(listCompanyJobsSchema, req.query);
    const result = await getCompanyJobs(req.user!.userId, input);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export { router as jobsRouter };