'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientApiFetch, readApiError } from '@/lib/api';

export default function JobActions({
  jobId,
  currentStatus,
}: {
  jobId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callAction(action: 'publish' | 'close') {
    setLoading(true);
    setError(null);

    try {
      const res = await clientApiFetch(`/api/jobs/${jobId}/${action}`, {
        method: 'POST' 
      });

      if (!res.ok) {
        throw new Error(await readApiError(res));
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}
      <div className="flex gap-2">
        {currentStatus === 'draft' && (
          <button
            onClick={() => callAction('publish')}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        )}
        {currentStatus === 'open' && (
          <button
            onClick={() => callAction('close')}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {loading ? 'Closing...' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
}