import type { ApiClient } from './client';

type HealthcheckResponse = {
  status: string;
  service: string;
};

export class HealthcheckApi {
  constructor(private client: ApiClient) {}

  check() {
    return this.client.get<HealthcheckResponse>('/healthcheck', {
      signal: AbortSignal.timeout(500),
    });
  }
}
