import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'What changed in Octoflow, release by release.',
};

// Refreshes periodically rather than on every request — the changelog
// doesn't need to be live like /status, just not stale for long.
export const revalidate = 300;

const CHANGELOG_URL = 'https://raw.githubusercontent.com/OctoHubOSS/Octoflow/main/CHANGELOG.md';

const CATEGORY_COLOR: Record<string, string> = {
  Added: '#0ca30c',
  Changed: '#2a78d6',
  Fixed: '#eda100',
  Removed: '#d03b3b',
  Deprecated: '#898781',
  Security: '#9085e9',
};

async function getChangelog(): Promise<string | null> {
  try {
    const res = await fetch(CHANGELOG_URL, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export default async function ChangelogPage() {
  const raw = await getChangelog();

  // Our page renders its own <h1>, so the changelog's leading "# Changelog"
  // (and the intro line right after it) would just duplicate that — drop them.
  // The "[Unreleased]" section is also dropped — it's a working area for
  // changes that haven't actually shipped yet, not something public readers
  // need to see.
  const body = raw
    ?.replace(/^#\s+Changelog\s*\n+/, '')
    .replace(/^All notable changes.*?format\.\s*\n+/s, '')
    .replace(/^##\s*\[Unreleased\][\s\S]*?(?=^##\s*\[)/m, '');

  return (
    <main className="flex flex-1 justify-center px-4 py-20">
      <article className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
          <p className="text-sm text-fd-muted-foreground">
            Every notable change to Octoflow, newest first. Sourced directly from the{' '}
            <a
              href="https://github.com/OctoHubOSS/Octoflow/blob/main/CHANGELOG.md"
              className="underline hover:text-fd-foreground"
              target="_blank"
              rel="noreferrer noopener"
            >
              bot repository
            </a>
            .
          </p>
        </div>

        {!body ? (
          <div className="rounded-xl border border-fd-border bg-fd-card px-6 py-4 text-sm text-fd-muted-foreground">
            Couldn&apos;t load the changelog right now. Try again shortly, or read it directly on{' '}
            <a
              href="https://github.com/OctoHubOSS/Octoflow/blob/main/CHANGELOG.md"
              className="underline hover:text-fd-foreground"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
            .
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
          </div>
        )}

        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors w-fit"
        >
          Read the Docs
          <ArrowRight className="size-4" />
        </Link>
      </article>
    </main>
  );
}

const markdownComponents: Components = {
  // A version header, e.g. "[Unreleased]" or "[2.0.0] - 2026-08-25".
  h2: ({ children }) => (
    <h2 className="text-xl font-bold tracking-tight pt-6 border-t border-fd-border first:pt-0 first:border-t-0">
      {children}
    </h2>
  ),
  // A category within a version, e.g. "Added" / "Changed" / "Fixed".
  h3: ({ children }) => {
    const text = typeof children === 'string' ? children : String(children);
    const color = CATEGORY_COLOR[text] ?? 'var(--fd-muted-foreground)';
    return (
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mt-4 mb-2">
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
        <span style={{ color }}>{children}</span>
      </h3>
    );
  },
  p: ({ children }) => <p className="text-sm text-fd-muted-foreground leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-fd-muted-foreground">{children}</ul>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} className="underline hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-fd-muted px-1.5 py-0.5 text-xs font-mono">{children}</code>
  ),
  strong: ({ children }) => <strong className="font-semibold text-fd-foreground">{children}</strong>,
};
