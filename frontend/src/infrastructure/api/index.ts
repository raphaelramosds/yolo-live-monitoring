import { ApiClient } from './client';
import { ConnectionsApi } from './connections';
import { HealthcheckApi } from './healthcheck';

const client = new ApiClient(process.env.NEXT_PUBLIC_API_URL ?? '');

export const api = {
  baseUrl: client.baseUrl,
  connections: new ConnectionsApi(client),
  healthcheck: new HealthcheckApi(client),
};
