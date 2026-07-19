import { hashPassword, verifyPassword } from '../../shared/password';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { findUserByEmail, createUser } from './auth.repo';
import type { RegisterInput, LoginInput } from './auth.schema';
import { signAccessToken } from '../../shared/token';
import crypto from 'node:crypto';
import { config } from '../../shared/config';
import {
  createRefreshToken,
  findRefreshTokenByHash,
  deleteRefreshTokenByHash,
  deleteAllRefreshTokensForUser,
  findUserById,
} from './auth.repo';

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

export async function login(input: LoginInput,): Promise<{ id: string; email: string; role: string; accessToken: string, refreshToken: string }> {
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

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.role);

  return { id: user.id, email: user.email, role: user.role, accessToken, refreshToken };
}

async function issueTokenPair(
  userId: string,
  role: 'admin' | 'recruiter' | 'applicant',
): Promise<{ accessToken: string; refreshToken: string }> {
  
  const rawRefreshToken = crypto.randomBytes(32).toString('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex');

  const expiresAt = new Date(
    Date.now() + config.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await createRefreshToken(userId, tokenHash, expiresAt);

  const accessToken = signAccessToken({ sub: userId, role });

  return { accessToken, refreshToken: rawRefreshToken };
}

export async function refresh(
  rawToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const hash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const tokenRow = await findRefreshTokenByHash(hash);
  if (!tokenRow) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await findUserById(tokenRow.user_id);
  if (!user || user.status !== 'active') {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  await deleteRefreshTokenByHash(hash);

  return issueTokenPair(user.id, user.role);
}

export async function logout(rawToken: string): Promise<void> {
  const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
 
  await deleteRefreshTokenByHash(hash);
}