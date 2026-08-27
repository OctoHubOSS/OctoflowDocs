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
  source?: 'external';
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

export interface PublicStats {
  total_webhooks: number;
  total_repos: number;
  events_last_24h: number;
  events_last_7d: number;
  events_last_30d: number;
  events_all_time: number;
  guild_count: number;
  member_count: number;
  shard_count: number;
}

// Pure-aggregate totals, no guild-identifying data - safe to expose with no
// auth, same trust level as getHealth(). Separate from the admin panel's
// stats, which also carries banned/broken counts meant for operators only.
export function getPublicStats(): Promise<PublicStats | null> {
  return safeFetchJson<PublicStats>(`${API_URL}/api/stats/summary`);
}

function getInternalStatusHistory(days = 90): Promise<DayUptime[] | null> {
  return safeFetchJson<DayUptime[]>(`${API_URL}/api/status/history?days=${days}`);
}

const EXTERNAL_HISTORY_URL =
  process.env.EXTERNAL_STATUS_HISTORY_URL ??
  'https://raw.githubusercontent.com/OctoHubOSS/Octoflow/main/status-history.ndjson';

interface ExternalCheck {
  checked_at: string;
  reachable: boolean;
  database: boolean;
  discord: boolean;
  latency_ms: number;
}

async function getExternalStatusHistory(days: number): Promise<DayUptime[] | null> {
  let text: string;
  try {
    const res = await fetch(EXTERNAL_HISTORY_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    text = await res.text();
  } catch {
    return null;
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const byDay = new Map<string, { upCount: number; total: number; latencySum: number }>();

  for (const line of text.split('\n')) {
    if (!line.trim()) continue;

    let check: ExternalCheck;
    try {
      check = JSON.parse(line);
    } catch {
      continue;
    }

    const ts = Date.parse(check.checked_at);
    if (Number.isNaN(ts) || ts < cutoff) continue;

    const date = check.checked_at.slice(0, 10);
    const entry = byDay.get(date) ?? { upCount: 0, total: 0, latencySum: 0 };
    entry.total += 1;
    entry.latencySum += check.latency_ms ?? 0;
    if (check.reachable && check.database && check.discord) entry.upCount += 1;
    byDay.set(date, entry);
  }

  return Array.from(byDay.entries())
    .map(([date, { upCount, total, latencySum }]) => ({
      date,
      uptime_percent: total > 0 ? (100 * upCount) / total : 0,
      avg_latency_ms: total > 0 ? latencySum / total : 0,
      checks: total,
      source: 'external' as const,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getStatusHistory(days = 90): Promise<DayUptime[] | null> {
  const [internal, external] = await Promise.all([
    getInternalStatusHistory(days),
    getExternalStatusHistory(days),
  ]);

  if (!internal && !external) return null;

  const byDate = new Map<string, DayUptime>();
  for (const day of external ?? []) byDate.set(day.date, day);
  for (const day of internal ?? []) byDate.set(day.date, day); // internal wins on overlap

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export interface DashboardRepo {
  id: string;
  repo_name: string;
  channel_id: string;
  channel_name?: string;
  use_threads: boolean;
}

export interface DashboardModifier {
  id: string;
  repo_id?: string;
  events: string[];
  blacklisted: boolean;
  whitelisted: boolean;
  redirect_channel?: string;
  redirect_channel_name?: string;
  priority: number;
}

export interface DashboardWebhook {
  id: string;
  comment: string;
  broken: boolean;
  batch_events: boolean;
  created_at: string;
  repos: DashboardRepo[];
  event_modifiers: DashboardModifier[];
}

export interface DashboardChannel {
  id: string;
  name: string;
  type: number;
}

export interface AnalyticsDay {
  date: string;
  count: number;
}

export interface AnalyticsEventType {
  event_type: string;
  count: number;
}

export interface AnalyticsResponse {
  per_day: AnalyticsDay[];
  by_type: AnalyticsEventType[];
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

function internalSecret(): string | null {
  return process.env.DASHBOARD_INTERNAL_SECRET ?? null;
}

async function dashboardFetch<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<ApiResult<T>> {
  const secret = internalSecret();
  if (!secret) return { ok: false, error: 'Dashboard backend is not configured.' };

  try {
    const res = await fetch(`${API_URL}/api/dashboard${path}`, {
      method: init?.method ?? 'GET',
      headers: {
        'X-Internal-Secret': secret,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const error = (data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`);
      return { ok: false, error };
    }

    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: 'Could not reach the Octoflow API.' };
  }
}

export async function getDashboardGuild(guildId: string): Promise<DashboardWebhook[] | null> {
  const result = await dashboardFetch<{ webhooks: DashboardWebhook[] }>(`/guilds/${guildId}`);
  return result.ok ? result.data.webhooks : null;
}

export async function getDashboardChannels(guildId: string): Promise<DashboardChannel[] | null> {
  const result = await dashboardFetch<{ channels: DashboardChannel[] }>(`/guilds/${guildId}/channels`);
  return result.ok ? result.data.channels : null;
}

export async function getDashboardAnalytics(
  guildId: string,
  days = 30,
  webhookId?: string,
): Promise<AnalyticsResponse | null> {
  const query = webhookId
    ? `?days=${days}&webhook_id=${webhookId}`
    : `?days=${days}`;
  const result = await dashboardFetch<AnalyticsResponse>(`/guilds/${guildId}/analytics${query}`);
  return result.ok ? result.data : null;
}

export function createWebhook(
  guildId: string,
  body: { comment: string; broken: boolean; acting_user_id: string },
): Promise<ApiResult<{ id: string; secret: string; url: string }>> {
  return dashboardFetch(`/guilds/${guildId}/webhooks`, { method: 'POST', body });
}

export function updateWebhook(
  id: string,
  body: {
    guild_id: string;
    comment?: string;
    broken?: boolean;
    batch_events?: boolean;
    acting_user_id: string;
  },
): Promise<ApiResult<{ ok: true }>> {
  return dashboardFetch(`/webhooks/${id}`, { method: 'PATCH', body });
}

export function resetWebhookSecret(
  id: string,
  body: { guild_id: string; acting_user_id: string },
): Promise<ApiResult<{ secret: string }>> {
  return dashboardFetch(`/webhooks/${id}/reset-secret`, { method: 'POST', body });
}

export function deleteWebhook(id: string, body: { guild_id: string }): Promise<ApiResult<{ ok: true }>> {
  return dashboardFetch(`/webhooks/${id}`, { method: 'DELETE', body });
}

export function createRepo(
  webhookId: string,
  body: { guild_id: string; owner: string; name: string; channel_id: string; acting_user_id: string },
): Promise<ApiResult<{ id: string; repo_name: string }>> {
  return dashboardFetch(`/webhooks/${webhookId}/repos`, { method: 'POST', body });
}

export function updateRepo(
  id: string,
  body: {
    guild_id: string;
    repo_name?: string;
    channel_id?: string;
    use_threads?: boolean;
    acting_user_id: string;
  },
): Promise<ApiResult<{ ok: true }>> {
  return dashboardFetch(`/repos/${id}`, { method: 'PATCH', body });
}

export function deleteRepo(id: string, body: { guild_id: string }): Promise<ApiResult<{ ok: true }>> {
  return dashboardFetch(`/repos/${id}`, { method: 'DELETE', body });
}

export function createModifier(
  webhookId: string,
  body: {
    guild_id: string;
    events: string;
    blacklisted: boolean;
    whitelisted: boolean;
    priority: number;
    repo_id?: string;
    redirect_channel?: string;
    acting_user_id: string;
  },
): Promise<ApiResult<{ id: string }>> {
  return dashboardFetch(`/webhooks/${webhookId}/modifiers`, { method: 'POST', body });
}

export function updateModifier(
  id: string,
  body: {
    guild_id: string;
    events?: string;
    blacklisted?: boolean;
    whitelisted?: boolean;
    priority?: number;
    repo_id?: string;
    redirect_channel?: string;
    acting_user_id: string;
  },
): Promise<ApiResult<{ ok: true }>> {
  return dashboardFetch(`/modifiers/${id}`, { method: 'PATCH', body });
}

export function deleteModifier(id: string, body: { guild_id: string }): Promise<ApiResult<{ ok: true }>> {
  return dashboardFetch(`/modifiers/${id}`, { method: 'DELETE', body });
}
