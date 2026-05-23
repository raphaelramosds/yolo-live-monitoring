import { useEffect, useState } from 'react';
import { api } from '@/infrastructure/api';
import type { Connection } from '@/types/connection';

type Status = 'loading' | 'success' | 'error';

export function useConnection(id: string | null) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!id) {
      setStatus('error');
      return;
    }

    api.connections
      .getById(id)
      .then((data) => {
        setConnection(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  return { connection, setConnection, status };
}
