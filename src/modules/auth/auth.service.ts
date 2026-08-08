import { generateOtp, hashOtp } from '../../shared/otp';
import { sendVerificationEmail } from '../../shared/mailer';
import { hashPassword, verifyPassword } from '../../shared/password';
import { ConflictError, UnauthorizedError, ForbiddenError, BadRequestError } from '../../shared/errors';
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
  createUser
} from './auth.repo';

import {
  createEmailVerification,
  findEmailVerification,
  deleteEmailVerificationsForUser,
  activateUser,
} from './auth.repo';

import {
  findInvitationByToken,
  findUserByEmail,
  createVerifiedUser,
  createRecruiterRow,
  deleteInvitation,
} from './auth.repo';
import type { AcceptInvitationInput } from './auth.schema';
import bcrypt from 'bcryptjs';

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

  const user = await createUser(input.email, passwordHash, input.role);

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + config.OTP_EXPIRES_IN_MINUTES * 60 * 1000);

  await createEmailVerification(user.id, otpHash, expiresAt);

  await sendVerificationEmail(input.email, otp);

  return user
}

export async function login(input: LoginInput,): Promise<{ id: string; email: string; role: string; accessToken: string, refreshToken: string }> {
  const user = await findUserByEmail(input.email);

  if (!user) {
    await verifyPassword(input.password, DUMMY_HASH);
    throw new UnauthorizedError('Invalid credentials');
  }

  if (user.status === 'unverified') {
    throw new UnauthorizedError('Email not verified');
  }
  if (user.status === 'suspended') {
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

export async function verifyEmail(
  email: string,
  otp: string,
): Promise<void> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid verification code');
  }

  if (user.status === 'active') {
    return;
  }

  const verification = await findEmailVerification(user.id);
  if (!verification) {
    throw new UnauthorizedError('Invalid verification code');
  }

  const submittedHash = hashOtp(otp);
  if (submittedHash !== verification.otp_hash) {
    throw new UnauthorizedError('Invalid verification code');
  }

  await activateUser(user.id);
  await deleteEmailVerificationsForUser(user.id);
}

export async function resendVerification(email: string): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  if (user.status === 'active') {
    return;
  }

  if (user.status !== 'unverified') {
    return;
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + config.OTP_EXPIRES_IN_MINUTES * 60 * 1000);

  await createEmailVerification(user.id, otpHash, expiresAt);
  await sendVerificationEmail(email, otp);
}

export async function acceptInvitation(input: AcceptInvitationInput) {
  const invitation = await findInvitationByToken(input.token);
  if (!invitation) {
    throw new BadRequestError('Invalid or expired invitation token.');
  }

  if (invitation.email.toLowerCase() !== input.email.toLowerCase()) {
    throw new BadRequestError('Invalid or expired invitation token.');
  }

  let userId: string;
  let userRole: 'recruiter' | 'admin' | 'applicant';

  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    if (existingUser.status !== 'active') {
      throw new ForbiddenError('Your account is not active.');
    }
    userId = existingUser.id;
    userRole = existingUser.role;
  } else {
    if (!input.password) {
      throw new BadRequestError('Password is required to create a new account.');
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    userId = await createVerifiedUser(input.email, passwordHash);
    userRole = 'recruiter';
  }

  await createRecruiterRow(userId, invitation.companyId, invitation.role);

  await deleteInvitation(invitation.id);

  return issueTokenPair(userId, userRole);

}