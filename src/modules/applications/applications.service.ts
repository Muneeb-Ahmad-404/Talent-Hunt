import { ValidationError, NotFoundError, ForbiddenError } from '../../shared/errors';
import * as repo from './applications.repo'
import { sendInterviewNotification } from '../../shared/mailer';

const STAGE_ORDER = [
  'applied', 'screening', 'interview', 'final_interview', 'offer', 'hired', 'rejected'
] as const;
type Stage = typeof STAGE_ORDER[number];

const TERMINAL_STAGES = new Set<Stage>(['hired', 'rejected']);

function assertValidTransition(current: Stage, target: Stage) {
  if (TERMINAL_STAGES.has(current)) {
    throw new ValidationError(`Cannot transition from terminal stage '${current}'`);
  }
  if (!STAGE_ORDER.includes(target)) {
    throw new ValidationError(`'${target}' is not a valid stage`);
  }
  // 'rejected' can be reached from any non-terminal stage
  if (target === 'rejected') return;

  const currentIdx = STAGE_ORDER.indexOf(current);
  const targetIdx  = STAGE_ORDER.indexOf(target);

  if (targetIdx <= currentIdx) {
    throw new ValidationError(
      `Cannot move backward from '${current}' to '${target}'`
    );
  }
}

export async function moveApplicationStage(
  userId: string,
  applicationId: string,
  targetStage: Stage
) {
  const recruiterCompanyId = await repo.recruiterCompanyId(userId)
  if (!recruiterCompanyId){
      throw new ForbiddenError('User does not have a company')
  }
  const application = await repo.findApplicationForCompany(applicationId, recruiterCompanyId);
  if (!application) throw new NotFoundError('Application not found');
  if (application.status === 'withdrawn') {
    throw new ValidationError('Cannot change stage of a withdrawn application');
  }

  assertValidTransition(application.stage as Stage, targetStage);

  return repo.updateApplicationStage(applicationId, targetStage);
}


const INTERVIEW_ELIGIBLE_STAGES = new Set(['applied', 'screening', 'interview']);

export async function scheduleInterview(
  userId: string,
  applicationId: string,
  body: { scheduledAt: string; meetingLink: string; notes?: string }
) {
  const companyId = await repo.recruiterCompanyId(userId)
  if (!companyId){
      throw new ForbiddenError('User does not have a company')
  }
  const application = await repo.findApplicationWithApplicant(applicationId, companyId);
  if (!application) throw new NotFoundError('Application not found');
  if (application.status === 'withdrawn') {
    throw new ValidationError('Cannot schedule interview for a withdrawn application');
  }

  // TODO: wrap stage update and interview insert in a transaction (ch52 pattern)
  
  // Advance stage to 'interview' if not already at or past it
  const currentStageIdx = STAGE_ORDER.indexOf(application.stage);
  const interviewIdx    = STAGE_ORDER.indexOf('interview');
  if (currentStageIdx < interviewIdx) {
    await repo.updateApplicationStage(applicationId, 'interview');
  }

  const interview = await repo.createInterview(
    applicationId,
    new Date(body.scheduledAt),
    body.meetingLink,
    body.notes ?? null
  );

  // Send notification — inline for now (ch67 moves this to a background job)
  await sendInterviewNotification(
    application.applicant_email,
    application.job_title,
    new Date(body.scheduledAt),
    body.meetingLink,
    body.notes ?? null
  );

  return interview;
}