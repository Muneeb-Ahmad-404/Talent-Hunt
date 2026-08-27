// src/worker/worker.ts
import { Worker, Job, Queue } from 'bullmq';
import { config } from '../shared/config';
import { JobName } from '../shared/queue';
import { sendApplicationConfirmationEmail, sendInterviewNotification } from '../shared/mailer';
import { processResume } from './handlers/processResume';
import { cleanupExpiredTokens } from './handlers/cleanupExpiredTokens';
import { cleanupExpiredOtps } from './handlers/cleanupExpiredOtps';
import { sendRecruiterDigest } from './handlers/sendRecruiterDigest';

const queue = new Queue('jobs', {
  connection: { url: config.REDIS_URL },
});

async function registerRepeatableJobs() {
  // Daily at midnight UTC
  await queue.upsertJobScheduler(
    'cleanup-expired-otps',
    { pattern: '0 0 * * *' },
    { 
      name: 'cleanup-expired-otps',
    }
  );

  // Daily at 01:00 UTC
  await queue.upsertJobScheduler(
    'cleanup-expired-refresh-tokens',
    {pattern: '0 1 * * *'},
    { 
      name: 'cleanup-expired-refresh-tokens',
    }
  );

  // Every Monday at 08:00 UTC
  await queue.upsertJobScheduler(
    'send-recruiter-digest',
    {pattern: '0 8 * * 1'},
    { name: 'send-recruiter-digest' }   
  );

  const jobs = await queue.getJobSchedulers();
  console.log('[worker] Repeatable jobs registered:', jobs.map(j => j.name));
}

registerRepeatableJobs().catch(console.error);

// Worker connection must be separate from the Queue connection
const worker = new Worker(
  'jobs',
  async (job: Job) => {
    console.log(`[worker] Processing job ${job.name} (id: ${job.id})`);

    switch (job.name as JobName) {
      case 'send-application-confirmation': {
        const { applicantEmail, jobTitle, companyName } = job.data;
        await sendApplicationConfirmationEmail(applicantEmail, jobTitle, companyName);
        break;
      }
      case 'process-resume': {
        const { resumeId, s3Key } = job.data;
        await processResume(resumeId, s3Key);
        break;
      }  
      case 'send-interview-notification': {
        const { applicantEmail, jobTitle, scheduledAt, meetingLink, notes } = job.data;
        await sendInterviewNotification(applicantEmail, jobTitle, scheduledAt, meetingLink, notes);
        break;
      }
      case 'cleanup-expired-otps': {
        await cleanupExpiredOtps();
        break;
      }
      case 'cleanup-expired-refresh-tokens': {
        await cleanupExpiredTokens();
        break;
      }
      case 'send-recruiter-digest': {
        await sendRecruiterDigest();
        break;
      }
      default:
        console.warn(`[worker] Unknown job name: ${job.name}. Skipping.`);
    }
  },
  {
    connection: { url: config.REDIS_URL },
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`[worker] Job completed: ${job.name} (id: ${job.id})`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] Job failed: ${job?.name} (id: ${job?.id})`, err.message);
});

console.log('[worker] Worker started and listening for jobs...');