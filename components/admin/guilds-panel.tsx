'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Ban, ShieldCheck } from 'lucide-react';
import { setGuildBannedAction } from '@/lib/admin-actions';
import type { AdminGuild } from '@/lib/admin-api';

export function GuildsPanel({ initialGuilds }: { initialGuilds: AdminGuild[] }) {
  const [guilds, setGuilds] = useState(initialGuilds);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggleBan(guild: AdminGuild) {
    setError(null);
    setPendingId(guild.id);
    startTransition(async () => {
      const result = await setGuildBannedAction(guild.id, !guild.banned);
      setPendingId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setGuilds((prev) => prev.map((g) => (g.id === guild.id ? { ...g, banned: !g.banned } : g)));
    });
  }

  if (guilds.length === 0) {
    return <p className="px-6 py-8 text-center text-sm text-fd-muted-foreground">No guilds yet.</p>;
  }

  return (
    <div className="flex flex-col">
      {error && <p className="px-6 pt-4 text-sm text-red-500">{error}</p>}
      <ul className="flex flex-col divide-y divide-fd-border">
        {guilds.map((guild) => (
          <li key={guild.id} className="flex flex-wrap items-center gap-3 px-6 py-3">
            {guild.icon ? (
              <Image
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                alt=""
                width={32}
                height={32}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-fd-border bg-fd-muted text-xs font-semibold">
                {(guild.name ?? guild.id).slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{guild.name ?? 'Unknown server'}</span>
              <span className="text-xs text-fd-muted-foreground font-mono break-all">{guild.id}</span>
            </div>
            <span className="text-xs text-fd-muted-foreground tabular-nums shrink-0">
              {guild.webhook_count} webhook{guild.webhook_count === 1 ? '' : 's'} · {guild.repo_count} repo
              {guild.repo_count === 1 ? '' : 's'}
            </span>
            {guild.banned && (
              <span className="text-xs font-medium px-2 py-1 rounded-full text-white bg-red-500/90 shrink-0">
                Banned
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleBan(guild)}
              disabled={pendingId === guild.id}
              className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-fd-border px-3 py-1.5 hover:bg-fd-muted transition-colors disabled:opacity-50 shrink-0"
            >
              {guild.banned ? (
                <>
                  <ShieldCheck className="size-3.5" />
                  Unban
                </>
              ) : (
                <>
                  <Ban className="size-3.5" />
                  Ban
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
