import Link from 'next/link';
import { ButtonLink } from '@/components/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <nav className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-950"
          >
            Talent Hunt<span className="text-slate-400">.</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/jobs"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
            >
              Browse jobs
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              A focused hiring workspace
            </p>

            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Better hiring starts with a clearer process.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Talent Hunt gives applicants a simple way to discover
              opportunities and gives recruiting teams a focused workspace to
              move candidates through the hiring process.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/jobs">
                Explore open roles
              </ButtonLink>

              <Link
                href="/login"
                className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                Sign in
                <span className="ml-1.5 text-slate-400" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Hiring workspace
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Keep every application moving.
                    </p>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-slate-100" />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        OPEN POSITION
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        Senior Backend Engineer
                      </p>
                    </div>

                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Hiring
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100">
                  <div className="p-5">
                    <p className="text-xs text-slate-400">Applications</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      24
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-400">Interview</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      6
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-400">Next step</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      Review
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium text-slate-400">
                    WORKFLOW
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-2 flex-1 rounded-full bg-slate-900" />
                    <span className="h-2 flex-1 rounded-full bg-slate-300" />
                    <span className="h-2 flex-1 rounded-full bg-slate-200" />
                    <span className="h-2 flex-1 rounded-full bg-slate-200" />
                  </div>

                  <div className="mt-3 flex justify-between text-[11px] text-slate-400">
                    <span>Applied</span>
                    <span>Screening</span>
                    <span>Interview</span>
                    <span>Decision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-slate-100 pt-8 sm:mt-24">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                For applicants
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover roles, submit applications, and keep track of every
                opportunity in one place.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                For recruiting teams
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review candidates, manage hiring stages, schedule interviews,
                and record decisions.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                One focused workflow
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep job discovery and hiring decisions organized without
                unnecessary complexity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}