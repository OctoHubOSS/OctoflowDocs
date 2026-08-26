'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import * as api from '@/lib/api';
import type { ApiResult } from '@/lib/api';

// Every action re-derives the session and re-checks guild membership itself —
// never trust a guildId passed from the client alone. This is the same
// defense-in-depth check the [guildId] page already does before rendering.
async function assertManages(guildId: string): Promise<{ userId: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: 'Not logged in.' };
  if (!session.guilds.some((g) => g.id === guildId)) {
    return { error: "You don't have permission to manage this server." };
  }
  return { userId: session.discordUserId };
}

function revalidate(guildId: string) {
  revalidatePath(`/dashboard/${guildId}`);
}

export async function createWebhookAction(
  guildId: string,
  comment: string,
  broken: boolean,
): Promise<ApiResult<{ id: string; secret: string; url: string }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.createWebhook(guildId, { comment, broken, acting_user_id: auth.userId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function updateWebhookAction(
  guildId: string,
  id: string,
  fields: { comment?: string; broken?: boolean },
): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.updateWebhook(id, { guild_id: guildId, ...fields, acting_user_id: auth.userId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function resetWebhookSecretAction(
  guildId: string,
  id: string,
): Promise<ApiResult<{ secret: string }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.resetWebhookSecret(id, { guild_id: guildId, acting_user_id: auth.userId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function deleteWebhookAction(guildId: string, id: string): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.deleteWebhook(id, { guild_id: guildId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function createRepoAction(
  guildId: string,
  webhookId: string,
  owner: string,
  name: string,
  channelId: string,
): Promise<ApiResult<{ id: string; repo_name: string }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.createRepo(webhookId, {
    guild_id: guildId,
    owner,
    name,
    channel_id: channelId,
    acting_user_id: auth.userId,
  });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function updateRepoAction(
  guildId: string,
  id: string,
  fields: { repo_name?: string; channel_id?: string },
): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.updateRepo(id, { guild_id: guildId, ...fields, acting_user_id: auth.userId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function deleteRepoAction(guildId: string, id: string): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.deleteRepo(id, { guild_id: guildId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function createModifierAction(
  guildId: string,
  webhookId: string,
  fields: {
    events: string;
    blacklisted: boolean;
    whitelisted: boolean;
    priority: number;
    repo_id?: string;
    redirect_channel?: string;
  },
): Promise<ApiResult<{ id: string }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.createModifier(webhookId, { guild_id: guildId, ...fields, acting_user_id: auth.userId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function updateModifierAction(
  guildId: string,
  id: string,
  fields: {
    events?: string;
    blacklisted?: boolean;
    whitelisted?: boolean;
    priority?: number;
    repo_id?: string;
    redirect_channel?: string;
  },
): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.updateModifier(id, { guild_id: guildId, ...fields, acting_user_id: auth.userId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function deleteModifierAction(guildId: string, id: string): Promise<ApiResult<{ ok: true }>> {
  const auth = await assertManages(guildId);
  if ('error' in auth) return { ok: false, error: auth.error };

  const result = await api.deleteModifier(id, { guild_id: guildId });
  if (result.ok) revalidate(guildId);
  return result;
}

export async function getChannelsAction(guildId: string) {
  const auth = await assertManages(guildId);
  if ('error' in auth) return null;
  return api.getDashboardChannels(guildId);
}
