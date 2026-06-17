import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  Shield,
  Hash,
  Eye,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

export const metadata: Metadata = {
  title: 'Invite Octoflow',
  description:
    'Add Octoflow to your Discord server and start receiving GitHub notifications in minutes.',
  openGraph: {
    title: 'Invite Octoflow to Discord',
    description:
      'Add Octoflow to your Discord server and start receiving GitHub notifications in minutes.',
    siteName: 'Octoflow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invite Octoflow to Discord',
    description:
      'Add Octoflow to your Discord server and start receiving GitHub notifications in minutes.',
    creator: '@HeyOctoflow',
  },
};

const INVITE_URL = 'https://gitlogs.xyz/invite';

const permissions = [
  {
    icon: MessageSquare,
    name: 'Send Messages',
    reason: 'Deliver GitHub event notifications to your channels.',
  },
  {
    icon: Eye,
    name: 'Read Message History',
    reason: 'Required to properly send embed messages.',
  },
  {
    icon: Hash,
    name: 'Embed Links',
    reason: 'Format event notifications as rich Discord embeds.',
  },
  {
    icon: Shield,
    name: 'Use Application Commands',
    reason: 'Register and run slash commands like /newhook and /newrepo.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Add to Discord',
    description:
      'Click the button below to start Discord\'s authorization flow. Select your server and authorize.',
  },
  {
    number: '02',
    title: 'Run /newhook',
    description:
      'Create your first webhook. The bot DMs you a URL and secret to register in GitHub.',
  },
  {
    number: '03',
    title: 'Register in GitHub',
    description:
      'Paste the webhook URL and secret into your GitHub repository or organization webhook settings.',
  },
  {
    number: '04',
    title: 'Run /newrepo',
    description:
      'Link a repository to a Discord channel. Events start flowing immediately.',
  },
];

export default function InvitePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20 max-w-4xl mx-auto w-full gap-16">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-fd-border bg-fd-muted overflow-hidden">
          <Image src="/logo.png" alt="Octoflow" width={48} height={48} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Invite Octoflow
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-lg leading-relaxed">
            Add Octoflow to your Discord server and start receiving GitHub
            notifications in minutes.
          </p>
        </div>
        <a
          href={INVITE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2.5 rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          <SiDiscord className="size-4" />
          Add to Discord
          <ArrowRight className="size-4" />
        </a>
      </div>

      {/* How it works */}
      <section className="w-full flex flex-col gap-8">
        <h2 className="text-xl font-semibold text-center">How it works</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 rounded-xl border border-fd-border bg-fd-card p-6"
            >
              <span className="text-2xl font-bold text-fd-muted-foreground/40 font-mono leading-none mt-0.5">
                {step.number}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-sm text-fd-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Permissions */}
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-xl font-semibold">Permissions requested</h2>
          <p className="text-sm text-fd-muted-foreground">
            Octoflow requests only what it needs to deliver notifications.
          </p>
        </div>
        <div className="flex flex-col divide-y divide-fd-border rounded-xl border border-fd-border overflow-hidden">
          {permissions.map((perm) => {
            const Icon = perm.icon;
            return (
              <div
                key={perm.name}
                className="flex items-start gap-4 bg-fd-card px-6 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fd-border bg-fd-muted mt-0.5">
                  <Icon className="size-3.5 text-fd-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{perm.name}</span>
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                  </div>
                  <span className="text-xs text-fd-muted-foreground">
                    {perm.reason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Support + Docs links */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <Link
          href="/docs"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          Read the Docs
          <ArrowRight className="size-4" />
        </Link>
        <a
          href="https://discord.gg/Sj2SWMZe2J"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          <SiDiscord className="size-4" />
          Support Server
        </a>
      </div>
    </main>
  );
}
