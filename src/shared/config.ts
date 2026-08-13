import { z } from 'zod';

try{
    process.loadEnvFile();
}
catch(err){
    console.error((err as Error).message);
}

const EnvSchema = z.object({
  NODE_ENV:               z.enum(['development', 'test', 'production']).default('development'),
  PORT:                   z.coerce.number().int().positive().default(3000),  // (3) COERCE: "3000" → 3000
  DATABASE_URL:           z.url(),                                  // required; secrets get no default
  REDIS_URL:              z.url(),
  JWT_SECRET:             z.string().min(32),                               // required AND long enough to be safe
  JWT_EXPIRES_IN:         z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
  SMTP_HOST:              z.string().default('localhost'),
  SMTP_PORT:              z.coerce.number().int().positive().default(587),
  SMTP_USER:              z.string().default(''),
  SMTP_PASS:              z.string().default(''),
  SMTP_FROM:              z.string().default('noreply@jobportal.local'),
  OTP_EXPIRES_IN_MINUTES: z.coerce.number().int().positive().default(15),
  INVITATION_EXPIRES_IN_HOURS: z.coerce.number().int().default(72),
  APP_BASE_URL: z.string().default('http://localhost:3000'),
  cacheTtlSeconds: z.coerce.number().default(60),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('✖ Invalid environment configuration', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;