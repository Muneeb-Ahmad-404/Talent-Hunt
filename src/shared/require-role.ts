import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from './errors';
import { getRecruiterCompany } from '../modules/companies/companies.repo';

export function requireRole(
  ...roles: ('admin' | 'recruiter' | 'applicant')[]
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Insufficient role'));
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    if (req.user.role === 'applicant' && roles.includes('recruiter')) {
      const company = await getRecruiterCompany(req.user.userId);

      if (company) {
        return next();
      }
    }

    return next(new ForbiddenError('Insufficient role'));
  };
}