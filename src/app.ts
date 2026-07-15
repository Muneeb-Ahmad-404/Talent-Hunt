import express, {Application, Request, Response} from "express";
import { errorHandler } from "./shared/error-handler";
import { authRouter } from "./modules/auth/auth.routes";

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

app.use('/auth', authRouter);

app.use(errorHandler);

export default app;