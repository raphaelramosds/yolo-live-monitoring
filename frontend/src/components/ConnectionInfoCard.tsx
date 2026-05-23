'use client';

import { useState } from 'react';
import { Wifi, Pencil, Trash2, Loader2, AlertCircle, Check, X } from 'lucide-react';
import type { Connection } from '@/types/connection';

type SaveStatus = 'idle' | 'loading' | 'error';
type DeleteStatus = 'idle' | 'confirming' | 'loading' | 'error';

type Props = {
  connection: Connection;
  apiUrl: string;
  onUpdate: (updated: Connection) => void;
  onDelete: () => void;
};

const inputClass =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition';

export default function ConnectionInfoCard({ connection, apiUrl, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRtspUrl, setEditRtspUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>('idle');

  function enterEditMode() {
    setEditName(connection.name);
    setEditRtspUrl(connection.rtsp_url);
    setEditDescription(connection.description ?? '');
    setSaveStatus('idle');
    setSaveError('');
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setSaveStatus('idle');
    setSaveError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus('loading');
    setSaveError('');

    try {
      const response = await fetch(`${apiUrl}/connections/${connection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          rtsp_url: editRtspUrl,
          description: editDescription || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Something went wrong');
      }

      onUpdate(result.data);
      setIsEditing(false);
      setSaveStatus('idle');
    } catch (error: any) {
      setSaveStatus('error');
      setSaveError(error.message);
    }
  }

  async function handleDelete() {
    setDeleteStatus('loading');
    try {
      const response = await fetch(`${apiUrl}/connections/${connection.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      onDelete();
    } catch {
      setDeleteStatus('error');
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Wifi className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {isEditing ? 'Edit Connection' : connection.name}
            </h2>
            <p className="text-sm text-slate-400">ID: {connection.id}</p>
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={enterEditMode}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => setDeleteStatus('confirming')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation / status */}
      {deleteStatus === 'confirming' && (
        <div className="flex items-center justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">Delete this connection? This cannot be undone.</p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Confirm
            </button>
            <button
              onClick={() => setDeleteStatus('idle')}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteStatus === 'loading' && (
        <div className="flex items-center gap-2 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Deleting connection...</span>
        </div>
      )}

      {deleteStatus === 'error' && (
        <div className="flex items-center gap-2 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
          <span className="text-sm">Failed to delete connection. Please try again.</span>
        </div>
      )}

      {/* Body */}
      <div className="pt-4 border-t border-slate-100">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Stream Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                RTSP URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editRtspUrl}
                onChange={(e) => setEditRtspUrl(e.target.value)}
                required
                className={`${inputClass} font-mono`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Description{' '}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                {saveError}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saveStatus === 'loading'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saveStatus === 'loading' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  <><Check className="h-4 w-4" />Save changes</>
                )}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">RTSP URL</p>
              <p className="font-mono text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 break-all">
                {connection.rtsp_url}
              </p>
            </div>

            {connection.description && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-sm text-slate-700">{connection.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
