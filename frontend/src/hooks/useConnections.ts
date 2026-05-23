import { useCallback, useEffect, useState } from 'react';
import { api } from '@/infrastructure/api';
import type { Connection } from '@/types/connection';

type Status = 'loading' | 'success' | 'error';

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await api.connections.getAll();
      setConnections(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { connections, status, refresh };
}
