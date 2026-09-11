export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm" role="status"><span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />{label}</div>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{message}</div>;
}

export function ErrorState({ message = 'Something went wrong.' }: { message?: string }) {
  return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">{message}</div>;
}

export function ForbiddenState() {
  return <ErrorState message="You do not have permission to view this page." />;
}

export function NotFoundState() {
  return <ErrorState message="The requested resource was not found." />;
}
