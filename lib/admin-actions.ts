'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import * as adminApi from '@/lib/admin-api';
import type { ApiResult } from '@/lib/api';

async function assertAdmin(): Promise<{ userId: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: 'Not logged in.' };

  const isAdmin = await adminApi.checkIsAdmin(session.discordUserId);
  if (!isAdmin) return { error: "You don't have admin access." };

  return { userId: session.discordUserId };
}

export async function getAdminStatsAction(): Promise<ApiResult<adminApi.AdminStats>> {
  const auth = await assertAdmin();
  if ('error' in auth) return { ok: false, error: auth.error };
  return adminApi.getAdminStats(auth.userId);
}

export async function getAdminGuildsAction(): Promise<ApiResult<{ guilds: adminApi.AdminGuild[] }>> {
  const auth = await assertAdmin();
  if ('error' in auth) return { ok: false, error: auth.error };
  return adminApi.getAdminGuilds(auth.userId);
}

export async function setGuildBannedAction(guildId: string, banned: boolean): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertAdmin();
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await adminApi.setGuildBanned(guildId, banned, auth.userId);
  if (result.ok) revalidatePath('/admin');
  return result;
}

export async function getAdminLogsAction(filters: {
  guildId?: string;
  webhookId?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResult<{ logs: adminApi.AdminLogEntry[] }>> {
  const auth = await assertAdmin();
  if ('error' in auth) return { ok: false, error: auth.error };
  return adminApi.getAdminLogs(auth.userId, filters);
}

export async function getAdminAuditLogAction(): Promise<ApiResult<{ entries: adminApi.AdminAuditEntry[] }>> {
  const auth = await assertAdmin();
  if ('error' in auth) return { ok: false, error: auth.error };
  return adminApi.getAdminAuditLog(auth.userId);
}
