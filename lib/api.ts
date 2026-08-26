export const API_URL = 'https://v2.gitlogs.xyz';

export interface HealthResponse {
  database: boolean;
  discord: boolean;
  guild_count: number;
  member_count: number;
  shard_count: number;
  checked_at: string;
}

export interface DayUptime {
  date: string;
  uptime_percent: number;
  avg_latency_ms: number;
  checks: number;
}

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok && res.status !== 503) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getHealth(): Promise<HealthResponse | null> {
  return safeFetchJson<HealthResponse>(`${API_URL}/api/health`);
}

export function getStatusHistory(days = 90): Promise<DayUptime[] | null> {
  return safeFetchJson<DayUptime[]>(`${API_URL}/api/status/history?days=${days}`);
}
