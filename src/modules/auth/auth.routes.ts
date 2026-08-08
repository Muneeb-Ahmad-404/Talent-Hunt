import { Router } from 'express';
import { validateBody } from '../../shared/validate';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from './auth.schema';
import { 
  register,
  login, 
  refresh, 
  logout, 
  verifyEmail, 
  resendVerification
} from './auth.service';
import { acceptInvitationSchema } from './auth.schema';
import { acceptInvitation } from './auth.service';
import { authMiddleware } from '../../shared/auth-middleware';
import { requireRole } from '../../shared/require-role';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const body = validateBody(registerSchema, req.body);
    const user = await register(body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = validateBody(loginSchema, req.body);
    const user = await login(body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = validateBody(refreshSchema, req.body);
    const tokens = await refresh(refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = validateBody(logoutSchema, req.body);
    await logout(refreshToken);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post('/verify-email', async (req, res, next) => {
  try {
    const { email, otp } = validateBody(verifyEmailSchema, req.body);
    await verifyEmail(email, otp)
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/resend-verification', async (req, res, next) => {
  try {
    const { email } = validateBody(resendVerificationSchema, req.body);
    await resendVerification(email)
    res.status(200).json({ message: 'If that email is pending verification, a new code has been sent' });
  } catch (err) {
    next(err);
  }
});

router.post('/accept-invitation', async (req, res, next) => {
  try {
    const input = validateBody(acceptInvitationSchema, req.body);
    const tokens = await acceptInvitation(input);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
});


export { router as authRouter };