'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Square, AlertCircle } from 'lucide-react';

type Props = {
  streamUrl: string;
};

export default function LiveStream({ streamUrl }: Props) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamLog, setStreamLog] = useState<string[]>([]);
  const [streamError, setStreamError] = useState('');

  useEffect(() => {
    return () => eventSourceRef.current?.close();
  }, []);

  function startStream() {
    setStreamLog([]);
    setStreamError('');

    const es = new EventSource(streamUrl);

    es.onmessage = (event) => {
      setStreamLog((prev) => [event.data, ...prev].slice(0, 100));
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      setIsStreaming(false);
      setStreamError('Stream connection lost.');
    };

    eventSourceRef.current = es;
    setIsStreaming(true);
  }

  function stopStream() {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsStreaming(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Live Stream</h3>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <button
          onClick={isStreaming ? stopStream : startStream}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
            isStreaming
              ? 'text-red-600 border border-red-200 hover:bg-red-50'
              : 'text-white bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isStreaming ? (
            <><Square className="h-4 w-4" />Stop</>
          ) : (
            <><Play className="h-4 w-4" />Play</>
          )}
        </button>
      </div>

      {streamError && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
          {streamError}
        </div>
      )}

      <div className="h-48 overflow-y-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-1">
        {streamLog.length === 0 ? (
          <p className="text-slate-500 select-none">
            {isStreaming ? 'Waiting for events...' : 'Press Play to start the stream.'}
          </p>
        ) : (
          streamLog.map((entry, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-500 shrink-0">›</span>
              <span>{entry}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
