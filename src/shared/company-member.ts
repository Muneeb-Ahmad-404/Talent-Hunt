import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from './errors';
import { getRecruiterCompany } from '../modules/companies/companies.repo';

export async function requireCompanyMember(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }

  try {
    const membership = await getRecruiterCompany(req.user.userId);
    if (!membership) {
      return next(new ForbiddenError('You are not a member of a company'));
    }

    req.company = membership;
    next();
  } catch (err) {
    next(err);
  }
}
