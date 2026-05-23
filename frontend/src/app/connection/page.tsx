'use client';

import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConnectionInfoCard from '@/components/ConnectionInfoCard';
import LiveStream from '@/components/LiveStream';
import { useConnection } from '@/hooks/useConnection';
import { api } from '@/infrastructure/api';

export default function ConnectionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const { connection, setConnection, status } = useConnection(id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-lg hover:bg-slate-100 transition">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connection Detail</h1>
          <p className="text-slate-500 mt-1">Stream connection overview.</p>
        </div>
      </header>

      {status === 'loading' && (
        <div className="flex items-center gap-2 p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Loading connection...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="font-semibold">Connection not found.</span>
        </div>
      )}

      {status === 'success' && connection && (
        <>
          <ConnectionInfoCard
            connection={connection}
            onUpdate={setConnection}
            onDelete={() => router.push('/')}
          />
          <LiveStream streamUrl={api.connections.streamUrl(connection.id)} />
        </>
      )}
    </div>
  );
}
