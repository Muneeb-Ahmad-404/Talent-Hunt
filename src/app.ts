import express, {Application, Request, Response} from "express";
import { errorHandler } from "./shared/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { applicantsRouter } from "./modules/applicants/applicants.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { companiesRouter } from "./modules/companies/companies.routes";

const app: Application = express();

app.use(express.json());

app.get("/jobs", (req: Request, res: Response)=>{
    res.json({status: "ok"});
});

// ── Infrastructure ──────────────────────────────────────────────
app.get('/health', async (_req: Request, res: Response) => {
  return res.send({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

export default app;