import { hashPassword, verifyPassword } from '../../shared/password';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { findUserByEmail, createUser } from './auth.repo';
import type { RegisterInput, LoginInput } from './auth.schema';
import { signAccessToken } from '../../shared/token';

// A pre-computed bcrypt hash of a throwaway string.
// Used in the login path when no user is found, so the timing cost of
// bcrypt.compare is always paid regardless of whether the email exists.
// Generate with: node -e "require('bcryptjs').hash('__dummy__',12).then(console.log)"
const DUMMY_HASH =
  '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36zLklGLsR9XFKQZ5kQlbri';

export async function register(
  input: RegisterInput,
): Promise<{ id: string; email: string; role: string }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new ConflictError('Email already taken');
  }

  const passwordHash = await hashPassword(input.password);
  return createUser(input.email, passwordHash, input.role);
}

export async function login(input: LoginInput,): Promise<{ id: string; email: string; role: string; accessToken: string }> {
  const user = await findUserByEmail(input.email);

  if (!user) {
    await verifyPassword(input.password, DUMMY_HASH);
    throw new UnauthorizedError('Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new UnauthorizedError('Account suspended');
  }

  const valid = await verifyPassword(input.password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });

  return { id: user.id, email: user.email, role: user.role, accessToken };
}