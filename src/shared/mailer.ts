import nodemailer from 'nodemailer';
import { config } from './config';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  // Use STARTTLS on port 587 / plaintext on 1025 (Mailpit). Port 465 needs secure: true.
  secure: false,
  auth:
    config.SMTP_USER && config.SMTP_PASS
      ? { user: config.SMTP_USER, pass: config.SMTP_PASS }
      : undefined,
});

export async function sendVerificationEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: config.SMTP_FROM,
    to,
    subject: 'Verify your email address',
    text: [
      'Welcome to the job portal.',
      '',
      'Your verification code is:',
      '',
      `    ${otp}`,
      '',
      'Enter this code in the app to activate your account.',
      'The code expires in 15 minutes.',
      '',
      'If you did not create an account, you can ignore this email.',
    ].join('\n'),
  });
}

export async function sendInvitationEmail(toEmail: string, rawToken: string) {
  const link = `${config.APP_BASE_URL}/auth/accept-invitation?token=${rawToken}`;
  await transporter.sendMail({
    to: toEmail,
    subject: 'You have been invited to join a company workspace',
    text: `You have been invited to join a company workspace. Accept your invitation here:\n\n${link}\n\nThis link expires in ${config.INVITATION_EXPIRES_IN_HOURS} hours.`,
  });
}