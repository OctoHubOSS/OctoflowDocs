import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { commandGroups, allCommands } from '@/lib/commands-data';
import { CommandsBrowser } from '@/components/commands-browser';

export const metadata: Metadata = {
  title: 'Commands',
  description: 'Every Octoflow slash command, searchable, at a glance.',
};

export default function CommandsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20 max-w-3xl mx-auto w-full gap-10">
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Commands</h1>
        <p className="text-lg text-fd-muted-foreground max-w-lg leading-relaxed">
          All {allCommands.length} Octoflow slash commands, organized by category. Every command
          also has a full reference page with parameters and examples.
        </p>
      </div>

      <CommandsBrowser groups={commandGroups} />

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <Link
          href="/docs/commands"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          <BookOpen className="size-4" />
          Full Command Reference
        </Link>
        <Link
          href="/invite"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          Invite Octoflow
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
