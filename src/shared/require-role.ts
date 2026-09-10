import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from './errors';
import { db } from './db';

export function requireRole(
  ...roles: ('admin' | 'recruiter' | 'applicant')[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Insufficient role'));
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    if (!roles.includes('recruiter')) {
      return next(new ForbiddenError('Insufficient role'));
    }

    db.query(
      'SELECT 1 FROM recruiters WHERE user_id = $1 LIMIT 1',
      [req.user.userId],
    )
      .then((result) => {
        if (result.rows.length > 0) return next();
        next(new ForbiddenError('Insufficient role'));
      })
      .catch(next);
  };
}
