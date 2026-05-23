import type { ApiClient } from './client';
import type { Connection } from '@/types/connection';

type ConnectionPayload = {
  name: string;
  rtsp_url: string;
  description: string | null;
};

type ConnectionMutationResult = {
  status: string;
  message: string;
  data: Connection;
};

export class ConnectionsApi {
  constructor(private client: ApiClient) {}

  getAll() {
    return this.client.get<Connection[]>('/connections');
  }

  getById(id: string | number) {
    return this.client.get<Connection>(`/connections/${id}`);
  }

  create(payload: ConnectionPayload) {
    return this.client.post<ConnectionMutationResult>('/connections', payload);
  }

  update(id: string | number, payload: ConnectionPayload) {
    return this.client.put<ConnectionMutationResult>(`/connections/${id}`, payload);
  }

  delete(id: string | number) {
    return this.client.delete(`/connections/${id}`);
  }

  streamUrl(id: string | number) {
    return `${this.client.baseUrl}/connections/${id}/stream`;
  }
}
