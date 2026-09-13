import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import type { CompanyMember } from '@/lib/types';
import MemberActions from './MemberActions';
import InviteMember from './InviteMember';
import { ErrorState, EmptyState } from '@/components/ui-states';
import { PageHeader, PageShell, StatusPill } from '@/components/ui';

export default async function MembersPage() {
  const [response, user] = await Promise.all([
    apiFetch('/api/companies/members'),
    getCurrentUser(),
  ]);

  if (!response.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Company workspace"
          title="Team members"
          description="Manage the people who can help run your hiring workspace."
        />
        <ErrorState
          message={
            response.status === 403
              ? 'You do not have permission to manage members.'
              : 'Unable to load members.'
          }
        />
      </PageShell>
    );
  }

  const { members }: { members: CompanyMember[] } = await response.json();

  const role = user?.memberships[0]?.companyRole;
  const canManage = role === 'owner' || role === 'hr_manager';
  const owner = role === 'owner';

  return (
    <PageShell>
      <PageHeader
        eyebrow="Company workspace"
        title="Team members"
        description="Manage workspace access and hiring responsibilities."
        action={canManage ? <InviteMember /> : undefined}
      />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-slate-900">Workspace members</h2>
          <p className="mt-1 text-sm text-slate-500">
            {members.length === 1
              ? '1 member has access to this workspace.'
              : `${members.length} members have access to this workspace.`}
          </p>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState message="No members found." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-5 py-3.5 font-medium text-slate-600">
                    Member
                  </th>
                  <th className="px-5 py-3.5 font-medium text-slate-600">
                    Role
                  </th>
                  <th className="px-5 py-3.5 font-medium text-slate-600">
                    Joined
                  </th>
                  <th className="px-5 py-3.5 text-right font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {members.map((member) => {
                  const initials = member.email
                    .split('@')[0]
                    .slice(0, 2)
                    .toUpperCase();

                  const formattedRole = member.companyRole.replace(
                    /_/g,
                    ' ',
                  );

                  return (
                    <tr
                      key={member.recruiterId}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {member.email}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Workspace member
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusPill status={formattedRole} />
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {new Date(member.joinedAt).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <MemberActions
                          recruiterId={member.recruiterId}
                          role={member.companyRole}
                          owner={owner}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}