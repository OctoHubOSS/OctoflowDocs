import type { AdminAuditEntry } from '@/lib/admin-api';

function formatAction(action: string): string {
  return action.replace(/_/g, ' ');
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AuditLogPanel({ entries }: { entries: AdminAuditEntry[] }) {
  if (entries.length === 0) {
    return <p className="px-6 py-8 text-center text-sm text-fd-muted-foreground">No admin actions recorded yet.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-fd-border">
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-wrap items-center gap-2 px-6 py-2.5 text-sm">
          <span className="font-medium">{formatAction(entry.action)}</span>
          {entry.target && <span className="text-fd-muted-foreground font-mono text-xs break-all">{entry.target}</span>}
          <span className="text-xs text-fd-muted-foreground font-mono">by {entry.admin_user_id}</span>
          <span className="ml-auto text-xs text-fd-muted-foreground tabular-nums shrink-0">
            {formatTimestamp(entry.created_at)}
          </span>
        </li>
      ))}
    </ul>
  );
}
