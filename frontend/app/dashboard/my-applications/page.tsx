import { getCurrentUser } from '@/lib/session';
import ApplicantApplications from './ApplicantApplications';
import { redirect } from 'next/navigation';

export default async function ApplicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <ApplicantApplications />;
}