import Link from 'next/link';
import Image from 'next/image';
import {
  GitPullRequest,
  Webhook,
  Bell,
  Filter,
  HardDrive,
  Code2,
  ArrowRight,
} from 'lucide-react';
import { SiDiscord, SiGithub } from 'react-icons/si';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Features />
      <QuickStart />
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-fd-border px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fd-muted-foreground">
        <span>&copy; {new Date().getFullYear()} NodeByte LTD. Not affiliated with Discord or GitHub.</span>
        <div className="flex items-center gap-4">
          <Link href="/status" className="hover:text-fd-foreground transition-colors">Status</Link>
          <Link href="/stats" className="hover:text-fd-foreground transition-colors">Stats</Link>
          <Link href="/changelog" className="hover:text-fd-foreground transition-colors">Changelog</Link>
          <Link href="/terms" className="hover:text-fd-foreground transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-fd-foreground transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center overflow-hidden">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial fade overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.08), transparent)',
        }}
      />
      {/* Bottom fade to background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent, hsl(var(--background)))',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted/50 px-4 py-1.5 text-xs text-fd-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Open source &amp; self-hostable
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <Image src="/logo.png" alt="Octoflow" width={56} height={56} />
        </div>

        <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          GitHub notifications
          <br />
          <span className="text-fd-muted-foreground font-normal">
            for Discord.
          </span>
        </h1>

        <p className="text-lg text-fd-muted-foreground max-w-xl leading-relaxed">
          Keep your team connected to every commit, pull request, and
          deployment without ever leaving your Discord server.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <a
            href="/invite"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            <SiDiscord className="size-4" />
            Add to Discord
          </a>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            View Docs
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://github.com/OctoHubOSS/Octoflow"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            <SiGithub className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description:
      'Receive instant Discord messages the moment something happens in your GitHub repository no polling, no delays.',
  },
  {
    icon: Filter,
    title: 'Event Filtering',
    description:
      'Whitelist or blacklist specific GitHub events per webhook. Only see the activity that matters to your team.',
  },
  {
    icon: Webhook,
    title: 'Webhook Management',
    description:
      'Create up to 5 webhooks per server. Each webhook supports multiple repositories routed to different channels.',
  },
  {
    icon: GitPullRequest,
    title: 'Multi-repo Support',
    description:
      'Link as many repositories as you need to a single webhook, each sending notifications to their own channel.',
  },
  {
    icon: HardDrive,
    title: 'Backup & Restore',
    description:
      'Export your webhook configuration as a JSON file and restore it at any time perfect for migrations.',
  },
  {
    icon: Code2,
    title: 'Open Source',
    description:
      'Fully open source and self-hostable. Run your own instance with your own database and bot token.',
  },
];

function Features() {
  return (
    <section className="px-4 py-24 max-w-6xl mx-auto w-full">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground mb-3">
          Features
        </p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Everything you need to stay in the flow
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 border border-fd-border rounded-xl overflow-hidden">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex flex-col gap-3 bg-fd-background p-8 hover:bg-fd-muted/30 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fd-border bg-fd-muted">
                <Icon className="size-4 text-fd-foreground" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-sm text-fd-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section className="relative px-4 py-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 50%, hsl(var(--primary) / 0.06), transparent)',
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Up and running in minutes
        </h2>
        <p className="text-fd-muted-foreground leading-relaxed">
          Invite the bot, run{' '}
          <code className="rounded bg-fd-muted px-1.5 py-0.5 text-xs font-mono">
            /newhook
          </code>
          , paste the URL into GitHub, and{' '}
          <code className="rounded bg-fd-muted px-1.5 py-0.5 text-xs font-mono">
            /newrepo
          </code>{' '}
          to start receiving events. That&apos;s it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-foreground px-5 py-2.5 text-sm font-semibold text-fd-background transition-opacity hover:opacity-80"
          >
            Read the Docs
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://discord.gg/Sj2SWMZe2J"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            <SiDiscord className="size-4" />
            Join our Discord
          </a>
        </div>
      </div>
    </section>
  );
}
