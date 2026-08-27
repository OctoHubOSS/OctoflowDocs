import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Layers, Radio, Users, Server, ArrowRight } from 'lucide-react';
import { getHealth, getStatusHistory, type DayUptime } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Status',
  description: 'Live status and 90-day uptime history for Octoflow.',
};

export const revalidate = 0;

type Level = 'good' | 'warning' | 'critical' | 'unknown';

const STATUS_COLOR: Record<Level, string> = {
  good: '#0ca30c',
  warning: '#fab219',
  critical: '#d03b3b',
  unknown: 'hsl(var(--fd-muted-foreground))',
};

function dayLevel(day: { uptime_percent: number; checks: number }): Level {
  if (day.checks === 0) return 'unknown';
  if (day.uptime_percent >= 99.9) return 'good';
  if (day.uptime_percent > 0) return 'warning';
  return 'critical';
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default async function StatusPage() {
  const [health, history] = await Promise.all([getHealth(), getStatusHistory(90)]);

  const overallLevel: Level = !health
    ? 'critical'
    : health.database && health.discord
      ? 'good'
      : health.database
        ? 'warning'
        : 'critical';

  const overallLabel: Record<Level, string> = {
    good: 'All systems operational',
    warning: 'Degraded performance',
    critical: 'Service disruption',
    unknown: 'Status unavailable',
  };

  const days = history ?? [];
  // Pad the front with "unknown" placeholders so the strip always shows a fixed
  // width of days, even before 90 days of snapshots have accumulated.
  const target = 90;
  const padded: (DayUptimeOrPad)[] = [
    ...Array.from({ length: Math.max(0, target - days.length) }, () => null),
    ...days,
  ];

  const overallUptimePercent =
    days.length > 0
      ? days.reduce((sum, d) => sum + d.uptime_percent, 0) / days.length
      : null;

  return (
    <main className="flex flex-1 flex-col items-center overflow-x-hidden px-4 py-20 max-w-3xl mx-auto w-full gap-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Status</h1>
        <p className="text-lg text-fd-muted-foreground max-w-lg leading-relaxed">
          Live health and uptime history for the Octoflow API and bot.
        </p>
      </div>

      {/* Overall banner */}
      <div className="w-full flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-6 py-4">
        <span
          className="flex h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: STATUS_COLOR[overallLevel] }}
          aria-hidden
        />
        <span className="font-semibold text-sm">{overallLabel[overallLevel]}</span>
        {overallUptimePercent !== null && (
          <span className="ml-auto text-sm text-fd-muted-foreground tabular-nums">
            {overallUptimePercent.toFixed(2)}% over 90 days
          </span>
        )}
      </div>

      {/* Component rows */}
      <section className="w-full flex flex-col gap-3">
        <ComponentRow
          icon={Database}
          name="API & Database"
          level={health ? (health.database ? 'good' : 'critical') : 'unknown'}
        />
        <ComponentRow
          icon={Radio}
          name="Discord Gateway"
          level={health ? (health.discord ? 'good' : 'critical') : 'unknown'}
        />
      </section>

      {/* Uptime strip */}
      <section className="w-full flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">90-day history</h2>
          <span className="text-xs text-fd-muted-foreground">
            Each bar is one day. Hover for details.
          </span>
        </div>
        <div className="flex gap-[3px] w-full">
          {padded.map((day, i) => {
            const level = day ? dayLevel(day) : 'unknown';
            const label = day
              ? `${day.date} - ${day.uptime_percent.toFixed(1)}% uptime, ${Math.round(day.avg_latency_ms)}ms avg` +
                (day.source === 'external' ? ' (recorded by an independent external check)' : '')
              : 'No data';
            return (
              <div
                key={i}
                className="group relative flex-1 h-8 rounded-[3px]"
                style={{ backgroundColor: STATUS_COLOR[level], opacity: level === 'unknown' ? 0.25 : 1 }}
              >
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[min(80vw,260px)] -translate-x-1/2 rounded-md border border-fd-border bg-fd-popover px-2.5 py-1.5 text-xs text-fd-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-xs text-fd-muted-foreground">
          <Legend color={STATUS_COLOR.good} label="Operational" />
          <Legend color={STATUS_COLOR.warning} label="Degraded" />
          <Legend color={STATUS_COLOR.critical} label="Down" />
          <Legend color={STATUS_COLOR.unknown} label="No data" faded />
        </div>
      </section>

      {/* Live counts */}
      <section className="w-full grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={Server} label="Servers" value={health ? formatCount(health.guild_count) : '—'} />
        <StatTile icon={Users} label="Users" value={health ? formatCount(health.member_count) : '—'} />
        <StatTile icon={Layers} label="Shards" value={health ? formatCount(health.shard_count) : '—'} />
      </section>

      <Link
        href="/docs"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
      >
        Read the Docs
        <ArrowRight className="size-4" />
      </Link>
    </main>
  );
}

type DayUptimeOrPad = DayUptime | null;

function ComponentRow({
  icon: Icon,
  name,
  level,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  level: Level;
}) {
  const label: Record<Level, string> = {
    good: 'Operational',
    warning: 'Degraded',
    critical: 'Down',
    unknown: 'Unknown',
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-fd-border bg-fd-card px-6 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fd-border bg-fd-muted">
        <Icon className="size-3.5 text-fd-foreground" />
      </div>
      <span className="text-sm font-semibold flex-1">{name}</span>
      <span
        className="text-xs font-medium px-2 py-1 rounded-full"
        style={{ color: STATUS_COLOR[level], backgroundColor: `${STATUS_COLOR[level]}1a` }}
      >
        {label[level]}
      </span>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-6">
      <div className="flex items-center gap-2 text-fd-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Legend({ color, label, faded }: { color: string; label: string; faded?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color, opacity: faded ? 0.25 : 1 }}
        aria-hidden
      />
      {label}
    </div>
  );
}
