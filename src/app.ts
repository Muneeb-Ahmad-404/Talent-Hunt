import express, {Application, Request, Response} from "express";
import { errorHandler } from "./shared/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { applicantsRouter } from "./modules/applicants/applicants.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { companiesRouter } from "./modules/companies/companies.routes";
import { jobsRouter } from "./modules/jobs/jobs.routes";
import { publicRouter } from './modules/public/publicRouter';
import { applicationsRouter } from "./modules/applications/applications.routes";
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import queue from './shared/queue';
import { globalLimiter } from "./shared/rateLimiter";
import { requestIdMiddleware } from "./middleware/requestId";
import { httpLogger } from "./middleware/httpLogger";

const app: Application = express();

app.use(express.json());
app.use(requestIdMiddleware);
app.use(httpLogger);     
app.use(globalLimiter);

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({ queues: [new BullMQAdapter(queue)], serverAdapter });

// ── Infrastructure ──────────────────────────────────────────────
app.get('/health', async (_req: Request, res: Response) => {
  return res.send({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/public', publicRouter);

app.use('/api/auth', authRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/jobs', jobsRouter)
app.use('/api/applications/', applicationsRouter);
app.use('/queues', serverAdapter.getRouter());

app.use(errorHandler);

export default app;