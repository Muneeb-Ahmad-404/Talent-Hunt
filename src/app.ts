import express, {Application, Request, Response} from "express";
import { errorHandler } from "./shared/error-handler";
import { NotFoundError } from './shared/errors';
import { ValidationError } from './shared/validate';
import { z } from 'zod';

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

// app.get('/test/not-found', (_req, _res, next) => {
//   next(new NotFoundError('Job not found'));
// });

// app.get('/test/validation', (_req, _res, next) => {
//   const schema = z.object({ title: z.string().min(1) });
//   const result = schema.safeParse({});
//   if (!result.success) {
//     next(new ValidationError(result.error));
//   } else {
//     next(new Error('Unexpected: schema should have failed'));
//   }
// });

// app.get('/test/unhandled', (_req, _res, next) => {
//   next(new Error('oops — raw error'));
// });

app.use(errorHandler);

export default app;