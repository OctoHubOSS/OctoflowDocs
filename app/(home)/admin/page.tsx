import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Shield, Server, Users, Layers, Webhook, ShieldAlert, Activity, CalendarRange } from 'lucide-react';
import { getSession } from '@/lib/session';
import { getAdminStatsAction, getAdminGuildsAction, getAdminAuditLogAction } from '@/lib/admin-actions';
import { GuildsPanel } from '@/components/admin/guilds-panel';
import { LogsPanel } from '@/components/admin/logs-panel';
import { AuditLogPanel } from '@/components/admin/audit-log-panel';

export const metadata: Metadata = {
  title: 'Bot Admin',
  description: 'Global stats, guild management, and audit logs for Octoflow operators.',
};

export const revalidate = 0;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect('/dashboard');
  }

  const statsResult = await getAdminStatsAction();

  if (!statsResult.ok) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 max-w-lg mx-auto w-full gap-4 text-center">
        <ShieldAlert className="size-8 text-fd-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Not available</h1>
        <p className="text-fd-muted-foreground">{statsResult.error}</p>
      </main>
    );
  }

  const [guildsResult, auditResult] = await Promise.all([
    getAdminGuildsAction(),
    getAdminAuditLogAction(),
  ]);

  const stats = statsResult.data;

  return (
    <main className="flex flex-1 flex-col px-4 py-20 max-w-4xl mx-auto w-full gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="size-7" />
          Bot Admin
        </h1>
        <p className="text-sm text-fd-muted-foreground">
          Logged in as <strong>{session.username}</strong>. Every action here is written to the audit log below.
        </p>
      </div>

      {/* Global stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={Server} label="Guilds" value={formatCount(stats.total_guilds)} sub={`${stats.banned_guilds} banned`} />
        <StatTile icon={Webhook} label="Webhooks" value={formatCount(stats.total_webhooks)} sub={`${stats.broken_webhooks} broken`} />
        <StatTile icon={Layers} label="Repos" value={formatCount(stats.total_repos)} />
        <StatTile icon={Activity} label="Events (24h)" value={formatCount(stats.events_last_24h)} sub={`${formatCount(stats.events_last_30d)} in 30d`} />
        <StatTile icon={Users} label="Bot members" value={formatCount(stats.bot_member_count)} />
        <StatTile icon={Server} label="Bot guilds" value={formatCount(stats.bot_guild_count)} />
        <StatTile icon={Layers} label="Shards" value={formatCount(stats.bot_shard_count)} />
        <StatTile
          icon={CalendarRange}
          label="Heartbeat"
          value={stats.heartbeat_updated_at ? new Date(stats.heartbeat_updated_at).toLocaleTimeString() : '—'}
        />
      </section>

      {/* Guild management */}
      <section className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
        <div className="px-6 py-4 border-b border-fd-border">
          <h2 className="text-sm font-semibold">Guilds</h2>
        </div>
        <GuildsPanel initialGuilds={guildsResult.ok ? guildsResult.data.guilds : []} />
        {!guildsResult.ok && <p className="px-6 py-4 text-sm text-red-500">{guildsResult.error}</p>}
      </section>

      {/* Webhook log browser */}
      <section className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
        <div className="px-6 py-4 border-b border-fd-border">
          <h2 className="text-sm font-semibold">Webhook logs</h2>
        </div>
        <LogsPanel />
      </section>

      {/* Admin audit trail */}
      <section className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
        <div className="px-6 py-4 border-b border-fd-border">
          <h2 className="text-sm font-semibold">Admin audit trail</h2>
        </div>
        <AuditLogPanel entries={auditResult.ok ? auditResult.data.entries : []} />
        {!auditResult.ok && <p className="px-6 py-4 text-sm text-red-500">{auditResult.error}</p>}
      </section>
    </main>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-4">
      <div className="flex items-center gap-2 text-fd-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      {sub && <span className="text-xs text-fd-muted-foreground tabular-nums">{sub}</span>}
    </div>
  );
}
