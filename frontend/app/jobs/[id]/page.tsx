'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function JobDetailPage() {
  const [status, setStatus] = useState<string | null>(null);

  const params : { id: string } = useParams();

  const API_URL = process.env.API_URL;

  async function handleApply() {
    const res = await fetch('/api/applicants/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobIds: [params.id], answers: {} }),
      credentials: 'include',
    });
    const data = await res.json();
    setStatus(res.ok ? 'Applied!' : data.message ?? 'Error');
  }

  async function handleShortlist() {
    const res = await fetch('/api/applicants/shortlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: params.id }),
      credentials: 'include',
    });
    setStatus(res.ok ? 'Shortlisted!' : 'Already shortlisted or error');
  }

  return (
    <main>
      <h1>Job {params.id}</h1>
      <button className='p-6' onClick={handleApply}>Apply</button>
      <button onClick={handleShortlist}>Shortlist</button>
      {status && <p>{status}</p>}
    </main>
  );
}