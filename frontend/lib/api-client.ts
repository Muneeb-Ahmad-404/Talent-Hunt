let refreshInFlight: Promise<boolean> | null = null

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({}),
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => { refreshInFlight = null })
  }
  return refreshInFlight
}

export async function clientApiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith('/api/') ? path : `/api${path.startsWith('/') ? path : `/${path}`}`
  const request = () => fetch(url, {
    ...options,
    credentials: 'include',
    headers: { Accept: 'application/json', ...options.headers },
  })
  let response = await request()
  if (response.status === 401 && !url.endsWith('/auth/refresh') && await refreshAccessToken()) response = await request()
  return response
}

const json = (body: unknown, method = 'POST'): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const apiRouter = {
  auth: {
    me: () => clientApiFetch('/auth/me'), login: (body: unknown) => clientApiFetch('/auth/login', json(body)), logout: () => clientApiFetch('/auth/logout', { method: 'POST' }), refresh: () => fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' }), register: (body: unknown) => clientApiFetch('/auth/register', json(body)), verifyEmail: (body: unknown) => clientApiFetch('/auth/verify-email', json(body)), resendVerification: (body: unknown) => clientApiFetch('/auth/resend-verification', json(body)), acceptInvitation: (body: unknown) => clientApiFetch('/auth/accept-invitation', json(body)),
  },
  public: { jobs: (query = '') => clientApiFetch(`/public/jobs${query}`), job: (id: string) => clientApiFetch(`/public/jobs/${id}`) },
  jobs: { list: (query = '') => clientApiFetch(`/jobs${query}`), detail: (id: string) => clientApiFetch(`/jobs/${id}`), create: (body: unknown) => clientApiFetch('/jobs', json(body)), update: (id: string, body: unknown) => clientApiFetch(`/jobs/${id}`, json(body, 'PATCH')), publish: (id: string) => clientApiFetch(`/jobs/${id}/publish`, { method: 'POST' }), close: (id: string) => clientApiFetch(`/jobs/${id}/close`, { method: 'POST' }) },
  companies: { me: () => clientApiFetch('/companies/me'), create: (body: unknown) => clientApiFetch('/companies', json(body)), members: () => clientApiFetch('/companies/members'), invite: (body: unknown) => clientApiFetch('/companies/invitations', json(body)), updateMember: (id: string, body: unknown) => clientApiFetch(`/companies/members/${id}`, json(body, 'PATCH')), removeMember: (id: string) => clientApiFetch(`/companies/members/${id}`, { method: 'DELETE' }) },
  applicants: { profile: () => clientApiFetch('/applicants/profile'), createProfile: (body: unknown) => clientApiFetch('/applicants/profile', json(body)), updateProfile: (body: unknown) => clientApiFetch('/applicants/profile', json(body, 'PATCH')), resumeUpload: () => clientApiFetch('/applicants/profile/resume-upload', { method: 'POST' }), confirmResume: (body: unknown) => clientApiFetch('/applicants/profile/resume', json(body)), applications: () => clientApiFetch('/applicants/applications'), shortlist: () => clientApiFetch('/applicants/shortlist'), apply: (body: unknown) => { const input = body as { jobId?: string; jobIds?: string[]; answers?: unknown }; return clientApiFetch('/applicants/apply', json({ jobIds: input.jobIds ?? (input.jobId ? [input.jobId] : []), answers: input.answers ?? {} })) }, addShortlist: (jobId: string) => clientApiFetch('/applicants/shortlist', json({ jobId })), removeShortlist: (jobId: string) => clientApiFetch(`/applicants/shortlist/${jobId}`, { method: 'DELETE' }) },
  applications: { pipeline: () => clientApiFetch('/applications'), moveStage: (id: string, stage: string) => clientApiFetch(`/applications/${id}/stage`, json({ stage }, 'PATCH')), scheduleInterview: (id: string, body: unknown) => clientApiFetch(`/applications/${id}/interview`, json(body)), feedback: (interviewId: string, body: unknown) => clientApiFetch(`/applications/interviews/${interviewId}/feedback`, json(body, 'PATCH')) },
  admin: { companies: (query = '') => clientApiFetch(`/admin/companies${query}`), verifyCompany: (id: string) => clientApiFetch(`/admin/companies/${id}/verify`, { method: 'PATCH' }), suspendCompany: (id: string) => clientApiFetch(`/admin/companies/${id}/suspend`, { method: 'PATCH' }), jobs: (query = '') => clientApiFetch(`/admin/jobs${query}`), job: (id: string) => clientApiFetch(`/admin/jobs/${id}`), closeJob: (id: string) => clientApiFetch(`/admin/jobs/${id}/close`, { method: 'PATCH' }), users: (query = '') => clientApiFetch(`/admin/users${query}`), suspendUser: (id: string) => clientApiFetch(`/admin/users/${id}/suspend`, { method: 'PATCH' }), activateUser: (id: string) => clientApiFetch(`/admin/users/${id}/activate`, { method: 'PATCH' }) },
}
