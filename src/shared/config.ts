import { z } from 'zod';

try{
    process.loadEnvFile();
}
catch(err){
    console.error((err as Error).message);
}

const EnvSchema = z.object({
  NODE_ENV:     z.enum(['development', 'test', 'production']).default('development'),
  PORT:         z.coerce.number().int().positive().default(3000),  // (3) COERCE: "3000" → 3000
  DATABASE_URL: z.url(),                                  // required; secrets get no default
  REDIS_URL:    z.url(),
  JWT_SECRET:   z.string().min(32),                               // required AND long enough to be safe
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('✖ Invalid environment configuration', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;