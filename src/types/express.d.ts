declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      role:   'admin' | 'recruiter' | 'applicant';
    };
    company?: {
      companyId: string;
      companyRole: 'owner' | 'hr_manager' | 'recruiter' | 'hiring_manager';
    };
  }
}