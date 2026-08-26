import type { Metadata } from 'next';
import Link from 'next/link';
import { Server, Users, Layers, ArrowRight } from 'lucide-react';
import { getHealth } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Stats',
  description: 'Live server, user, and shard counts for Octoflow.',
};

export const revalidate = 0;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default async function StatsPage() {
  const health = await getHealth();

  const tiles = [
    { icon: Server, label: 'Servers', value: health ? formatCount(health.guild_count) : '—' },
    { icon: Users, label: 'Users', value: health ? formatCount(health.member_count) : '—' },
    { icon: Layers, label: 'Shards', value: health ? formatCount(health.shard_count) : '—' },
  ];

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20 max-w-3xl mx-auto w-full gap-12">
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Stats</h1>
        <p className="text-lg text-fd-muted-foreground max-w-lg leading-relaxed">
          Live numbers, pulled directly from the bot.
        </p>
      </div>

      <section className="w-full grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col gap-3 rounded-xl border border-fd-border bg-fd-card p-8 items-center text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-fd-border bg-fd-muted">
              <tile.icon className="size-4 text-fd-foreground" />
            </div>
            <span className="text-4xl font-semibold tabular-nums">{tile.value}</span>
            <span className="text-sm text-fd-muted-foreground">{tile.label}</span>
          </div>
        ))}
      </section>

      {!health && (
        <p className="text-sm text-fd-muted-foreground">
          Live stats are temporarily unavailable. Check the{' '}
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
