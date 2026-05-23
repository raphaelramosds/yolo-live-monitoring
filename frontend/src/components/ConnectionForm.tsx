'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

type Props = {
  onSuccess?: () => void;
};

export default function ConnectionForm({ onSuccess }: Props) {
  const [name, setName] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setStatusMessage('');

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          rtsp_url: rtspUrl,
          description: description || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Something went wrong');
      }

      setSubmitStatus('success');
      setStatusMessage('Connection registered successfully!');
      setName('');
      setRtspUrl('');
      setDescription('');
      onSuccess?.();
    } catch (error: any) {
      setSubmitStatus('error');
      setStatusMessage(error.message);
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Stream Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Front Door Camera"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          RTSP URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          required
          placeholder="rtsp://user:pass@192.168.1.1:554/stream"
          className={`${inputClass} font-mono`}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Description{' '}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Brief description of this stream..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {submitStatus !== 'idle' && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-lg text-sm border ${
            submitStatus === 'loading'
              ? 'bg-slate-50 text-slate-700 border-slate-200'
              : submitStatus === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {submitStatus === 'loading' && (
            <Loader2 className="h-4 w-4 animate-spin mt-0.5 flex-shrink-0" />
          )}
          {submitStatus === 'success' && (
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
          )}
          {submitStatus === 'error' && (
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600" />
          )}
          <span>
            {submitStatus === 'loading' ? 'Saving connection...' : statusMessage}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitStatus === 'loading'}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {submitStatus === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Register Connection'
        )}
      </button>
    </form>
  );
}
