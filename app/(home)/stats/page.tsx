import type { Metadata } from 'next';
import Link from 'next/link';
import { Server, Users, Layers, Webhook, GitBranch, Activity, CalendarDays, CalendarRange, History, ArrowRight } from 'lucide-react';
import { getHealth, getPublicStats } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Stats',
  description: 'Live server, user, and activity counts for Octoflow.',
};

export const revalidate = 0;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default async function StatsPage() {
  const [health, stats] = await Promise.all([getHealth(), getPublicStats()]);

  const botTiles = [
    { icon: Server, label: 'Servers', value: health ? formatCount(health.guild_count) : '—' },
    { icon: Users, label: 'Users', value: health ? formatCount(health.member_count) : '—' },
    { icon: Layers, label: 'Shards', value: health ? formatCount(health.shard_count) : '—' },
  ];

  const configTiles = [
    { icon: Webhook, label: 'Webhooks configured', value: stats ? formatCount(stats.total_webhooks) : '—' },
    { icon: GitBranch, label: 'Repos connected', value: stats ? formatCount(stats.total_repos) : '—' },
  ];

  const eventTiles = [
    { icon: Activity, label: 'Last 24 hours', value: stats ? formatCount(stats.events_last_24h) : '—' },
    { icon: CalendarDays, label: 'Last 7 days', value: stats ? formatCount(stats.events_last_7d) : '—' },
    { icon: CalendarRange, label: 'Last 30 days', value: stats ? formatCount(stats.events_last_30d) : '—' },
    { icon: History, label: 'All time', value: stats ? formatCount(stats.events_all_time) : '—' },
  ];

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20 max-w-3xl mx-auto w-full gap-12">
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Stats</h1>
        <p className="text-lg text-fd-muted-foreground max-w-lg leading-relaxed">
          Live numbers, pulled directly from the bot and its database.
        </p>
      </div>

      <StatSection title="Bot" tiles={botTiles} />
      <StatSection title="Configuration" tiles={configTiles} />
      <StatSection
        title="GitHub events processed"
        tiles={eventTiles}
        note="Counted since event tracking was added - not a lifetime total from before then."
      />

      {(!health || !stats) && (
        <p className="text-sm text-fd-muted-foreground">
          Some live stats are temporarily unavailable. Check the{' '}
          <Link href="/status" className="underline hover:text-fd-foreground">
            status page
          </Link>{' '}
          for details.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <Link
          href="/status"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          View Status
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          Read the Docs
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}

// Tailwind needs the full class name literally in source to pick it up -
// an interpolated `sm:grid-cols-${n}` wouldn't survive the production
// build's CSS purge, so each tile count maps to a fixed, fully-written class.
const GRID_COLS_SM: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

function StatSection({
  title,
  tiles,
  note,
}: {
  title: string;
  tiles: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];
  note?: string;
}) {
  const smCols = GRID_COLS_SM[Math.min(tiles.length, 4)] ?? 'sm:grid-cols-4';

  return (
    <section className="w-full flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-fd-muted-foreground uppercase tracking-wide">{title}</h2>
      <div className={`grid grid-cols-2 gap-4 ${smCols}`}>
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-5 items-center text-center"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fd-border bg-fd-muted">
              <tile.icon className="size-3.5 text-fd-foreground" />
            </div>
            <span className="text-2xl font-semibold tabular-nums">{tile.value}</span>
            <span className="text-xs text-fd-muted-foreground">{tile.label}</span>
          </div>
        ))}
      </div>
      {note && <p className="text-xs text-fd-muted-foreground">{note}</p>}
    </section>
  );
}
