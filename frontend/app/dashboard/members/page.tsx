import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import type { CompanyMember } from '@/lib/types';
import MemberActions from './MemberActions';
import InviteMember from './InviteMember';
import { ErrorState, EmptyState } from '@/components/ui-states';

export default async function MembersPage() {
  const [response, user] = await Promise.all([apiFetch('/api/companies/members'), getCurrentUser()]);
  if (!response.ok) return <main className="p-6"><ErrorState message={response.status === 403 ? 'You do not have permission to manage members.' : 'Unable to load members.'} /></main>;
  const { members }: { members: CompanyMember[] } = await response.json();
  const role = user?.memberships[0]?.companyRole;
  const canManage = role === 'owner' || role === 'hr_manager';
  const owner = role === 'owner';
  return <main className="space-y-5 p-6"><div><p className="text-sm text-gray-500">Company workspace</p><h1 className="text-3xl font-semibold">Team members</h1></div>{canManage && <InviteMember />}{members.length === 0 ? <EmptyState message="No members found." /> : <div className="overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th><th className="p-3">Actions</th></tr></thead><tbody>{members.map((member) => <tr key={member.recruiterId} className="border-t"><td className="p-3">{member.email}</td><td className="p-3 capitalize">{member.companyRole.replace('_', ' ')}</td><td className="p-3">{new Date(member.joinedAt).toLocaleDateString()}</td><td className="p-3"><MemberActions recruiterId={member.recruiterId} role={member.companyRole} owner={owner} /></td></tr>)}</tbody></table></div>}</main>;
}
