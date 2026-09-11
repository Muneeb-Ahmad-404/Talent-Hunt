export type PlatformRole = 'applicant' | 'recruiter' | 'admin';
export type CompanyRole = 'owner' | 'hr_manager' | 'hiring_manager' | 'recruiter';

export type Membership = {
  recruiterId: string;
  companyId: string;
  companyName: string;
  companyStatus: string;
  companyRole: CompanyRole;
  joinedAt: string;
};

export type User = {
  id: string;
  email: string;
  role: PlatformRole;
  status: string;
  memberships: Membership[];
};

export type Job = {
  id: string;
  title: string;
  description?: string | null;
  companyName: string;
  location?: string | null;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  attributes?: Record<string, unknown>;
  screeningQuestions?: Array<{ text: string; type: 'text' | 'boolean' | 'url'; required: boolean }>;
  createdAt: string;
  status?: 'draft' | 'open' | 'closed' | string;
  deadline?: string | null;
};

export type Application = {
  id: string;
  stage: string;
  status?: string;
  job_title: string;
  company_name: string;
  created_at?: string;
  profile_snapshot?: {
    headline: string | null;
    bio: string | null;
    skills: string[];
    resumeKey: string | null;
  };
  screening_answers?: unknown[];
  upcoming_interview?: {
    id: string;
    scheduled_at: string;
    meeting_link: string;
    notes: string | null;
  } | null;
};

export type CompanyJob = { id: string; title: string; status: string; createdAt: string };
export type CompanyMember = { recruiterId: string; userId: string; email: string; companyRole: CompanyRole; joinedAt: string };
export type ShortlistItem = { id: string; job_id: string; title: string; company_name: string };
export type PipelineApplication = Application & {
  applicant_id: string;
  latest_interview?: {
    id: string;
    scheduled_at: string;
    meeting_link: string;
    outcome: string;
  } | null;
};
export type Pipeline = Record<'applied' | 'screening' | 'interview' | 'final_interview' | 'offer' | 'hired' | 'rejected', PipelineApplication[]>;
export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  meeting_link: string;
  notes?: string | null;
  feedback?: string | null;
  outcome?: 'pending' | 'moved_forward' | 'rejected' | string;
  created_at?: string;
};

export type ApplicantProfile = {
  id: string;
  user_id: string;
  email: string;
  headline: string | null;
  bio: string | null;
  skills: string[];
  created_at: string;
};
