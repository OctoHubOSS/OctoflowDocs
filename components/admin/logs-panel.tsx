'use client';

import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { getAdminLogsAction } from '@/lib/admin-actions';
import type { AdminLogEntry } from '@/lib/admin-api';

export function LogsPanel() {
  const [guildId, setGuildId] = useState('');
  const [webhookId, setWebhookId] = useState('');
  const [logs, setLogs] = useState<AdminLogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function search(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await getAdminLogsAction({ guildId: guildId || undefined, webhookId: webhookId || undefined, limit: 50 });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLogs(result.data.logs);
    });
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <form onSubmit={search} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-fd-muted-foreground">Guild ID</span>
          <input
            value={guildId}
            onChange={(e) => setGuildId(e.target.value)}
            placeholder="optional"
            className="rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-xs font-mono w-48"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-fd-muted-foreground">Webhook ID</span>
          <input
            value={webhookId}
            onChange={(e) => setWebhookId(e.target.value)}
            placeholder="optional"
            className="rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-xs font-mono w-48"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-3 py-1.5 text-xs font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Search className="size-3.5" />
          {isPending ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {logs === null ? (
        <p className="text-sm text-fd-muted-foreground">Search by guild or webhook ID, or leave blank for the most recent logs.</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-fd-muted-foreground">No logs matched.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {logs.map((log) => (
            <li key={log.log_id} className="rounded-lg border border-fd-border bg-fd-background px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-fd-muted-foreground font-mono mb-1.5">
                <span>guild {log.guild_id}</span>
                <span>·</span>
                <span>webhook {log.webhook_id}</span>
              </div>
              <pre className="text-xs whitespace-pre-wrap break-words text-fd-foreground">
                {log.entries.join('\n')}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
