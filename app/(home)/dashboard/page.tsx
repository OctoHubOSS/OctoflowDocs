import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, LogOut, ArrowRight } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your servers’ webhooks, repos, and event modifiers.',
};

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'You cancelled the Discord authorization.',
  invalid_state: 'Your login attempt expired or was invalid — please try again.',
  token_exchange_failed: 'Discord rejected the login attempt — please try again.',
  profile_fetch_failed: 'Could not fetch your Discord profile — please try again.',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 max-w-lg mx-auto w-full gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg text-fd-muted-foreground leading-relaxed">
            Log in with Discord to see the webhooks, repos, and event modifiers configured for
            servers you manage.
          </p>
        </div>

        {error && (
          <div className="w-full rounded-xl border border-fd-border bg-fd-card px-6 py-4 text-sm text-fd-muted-foreground">
            {ERROR_MESSAGES[error] ?? 'Something went wrong — please try again.'}
          </div>
        )}

        <a
          href="/api/auth/discord/login"
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          <SiDiscord className="size-4" />
          Log in with Discord
          <LogIn className="size-4" />
        </a>
      </main>
    );
  }

  if (session.guilds.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 max-w-lg mx-auto w-full gap-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">No manageable servers</h1>
        <p className="text-fd-muted-foreground leading-relaxed">
          You&apos;re logged in as <strong>{session.username}</strong>, but you don&apos;t have
          Manage Server permission on any server Octoflow can see. Invite the bot or check your
          permissions, then log back in.
        </p>
        <div className="flex gap-3">
          <Link
            href="/invite"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            Invite Octoflow
          </Link>
          <a
            href="/api/auth/logout"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            <LogOut className="size-4" />
            Log out
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-20 max-w-3xl mx-auto w-full gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-fd-muted-foreground">
            Logged in as <strong>{session.username}</strong>
          </p>
        </div>
        <a
          href="/api/auth/logout"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          <LogOut className="size-3.5" />
          Log out
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {session.guilds.map((guild) => (
          <Link
            key={guild.id}
            href={`/dashboard/${guild.id}`}
            className="flex items-center gap-4 rounded-xl border border-fd-border bg-fd-card px-6 py-4 transition-colors hover:bg-fd-muted/30"
          >
            {guild.icon ? (
              <Image
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fd-border bg-fd-muted text-sm font-semibold">
                {guild.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-semibold flex-1">{guild.name}</span>
            <ArrowRight className="size-4 text-fd-muted-foreground" />
          </Link>
        ))}
      </div>
    </main>
  );
}
