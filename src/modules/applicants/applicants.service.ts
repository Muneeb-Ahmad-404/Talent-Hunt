import * as repo from './applicants.repo';
import { ConflictError, NotFoundError } from '../../shared/errors';

export async function createProfile(
  userId: string,
  body: { headline: string; bio: string; skills: string[] }
) {
  const existing = await repo.findApplicantByUserId(userId);
  if (existing) throw new ConflictError('Profile already exists');
  return repo.createApplicantProfile(userId, body.headline, body.bio, body.skills);
}

export async function getProfile(userId: string) {
  const profile = await repo.findApplicantByUserId(userId);
  if (!profile) throw new NotFoundError('Profile not found');
  return profile;
}

export async function updateProfile(
  userId: string,
  fields: { headline?: string; bio?: string; skills?: string[] }
) {
  const profile = await repo.findApplicantByUserId(userId);
  if (!profile) throw new NotFoundError('Profile not found');
  return repo.updateApplicantProfile(profile.id, fields);
}