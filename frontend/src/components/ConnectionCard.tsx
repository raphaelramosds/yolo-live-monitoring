'use client';

import { useRouter } from 'next/navigation';
import { Wifi } from 'lucide-react';
import type { Connection } from '@/types/connection';

export default function ConnectionCard({ connection }: { connection: Connection }) {
  const router = useRouter();

  return (
    <div
      role="button"
      onClick={() => router.push(`/connection?id=${connection.id}`)}
      className="cursor-pointer bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <Wifi className="h-4 w-4 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-slate-800 truncate">{connection.name}</h3>
      </div>
      <p className="text-xs font-mono text-slate-500 truncate mb-2">{connection.rtsp_url}</p>
      {connection.description && (
        <p className="text-sm text-slate-500 line-clamp-2">{connection.description}</p>
      )}
    </div>
  );
}
