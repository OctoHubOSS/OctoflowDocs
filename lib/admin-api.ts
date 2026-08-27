import { API_URL, type ApiResult } from './api';

// Separate from lib/api.ts's dashboardFetch: every call here also carries
// X-Acting-User-Id, which the Go backend's AdminAuth middleware checks
// against its own Config.AdminUserIDs allowlist. The allowlist lives only on
// the Go side - Next.js never needs its own copy, it just always names who
// is asking and lets the backend decide.
async function adminFetch<T>(
  path: string,
  actingUserId: string,
  init?: { method?: string; body?: unknown },
): Promise<ApiResult<T>> {
  const secret = process.env.DASHBOARD_INTERNAL_SECRET;
  if (!secret) return { ok: false, error: 'Dashboard backend is not configured.' };

  try {
    const res = await fetch(`${API_URL}/api/admin${path}`, {
      method: init?.method ?? 'GET',
      headers: {
        'X-Internal-Secret': secret,
        'X-Acting-User-Id': actingUserId,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 403) {
        return { ok: false, error: "You don't have admin access." };
      }
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

export async function checkIsAdmin(actingUserId: string): Promise<boolean> {
  const result = await adminFetch<{ is_admin: boolean }>('/whoami', actingUserId);
  return result.ok;
}

export interface AdminStats {
  total_guilds: number;
  banned_guilds: number;
  total_webhooks: number;
  broken_webhooks: number;
  total_repos: number;
  events_last_24h: number;
  events_last_30d: number;
  bot_guild_count: number;
  bot_member_count: number;
  bot_shard_count: number;
  heartbeat_updated_at?: string;
}

export function getAdminStats(actingUserId: string): Promise<ApiResult<AdminStats>> {
  return adminFetch('/stats', actingUserId);
}

export interface AdminGuild {
  id: string;
  name?: string;
  icon?: string;
  banned: boolean;
  webhook_count: number;
  repo_count: number;
}

export async function getAdminGuilds(actingUserId: string): Promise<ApiResult<{ guilds: AdminGuild[] }>> {
  return adminFetch('/guilds', actingUserId);
}

export function setGuildBanned(
  guildId: string,
  banned: boolean,
  actingUserId: string,
): Promise<ApiResult<{ ok: true }>> {
  return adminFetch(`/guilds/${guildId}/ban`, actingUserId, {
    method: 'POST',
    body: { banned, acting_user_id: actingUserId },
  });
}

export interface AdminLogEntry {
  log_id: string;
  guild_id: string;
  webhook_id: string;
  entries: string[];
}

export function getAdminLogs(
  actingUserId: string,
  filters: { guildId?: string; webhookId?: string; limit?: number; offset?: number },
): Promise<ApiResult<{ logs: AdminLogEntry[] }>> {
  const params = new URLSearchParams();
  if (filters.guildId) params.set('guild_id', filters.guildId);
  if (filters.webhookId) params.set('webhook_id', filters.webhookId);
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.offset) params.set('offset', String(filters.offset));
  const query = params.toString() ? `?${params.toString()}` : '';
  return adminFetch(`/logs${query}`, actingUserId);
}

export interface AdminAuditEntry {
  id: number;
  admin_user_id: string;
  action: string;
  target?: string;
  detail?: string;
  created_at: string;
}

export function getAdminAuditLog(
  actingUserId: string,
  limit = 100,
): Promise<ApiResult<{ entries: AdminAuditEntry[] }>> {
  return adminFetch(`/audit-log?limit=${limit}`, actingUserId);
}
