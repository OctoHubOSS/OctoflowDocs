'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import type { CommandGroup } from '@/lib/commands-data';

export function CommandsBrowser({ groups }: { groups: CommandGroup[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;

    return groups
      .map((group) => ({
        ...group,
        commands: group.commands.filter(
          (cmd) => cmd.name.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.commands.length > 0);
  }, [groups, query]);

  return (
    <div className="w-full flex flex-col gap-8">
      <label className="relative flex items-center w-full">
        <Search className="absolute left-3.5 size-4 text-fd-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands..."
          className="w-full rounded-xl border border-fd-border bg-fd-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary/50"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="text-sm text-fd-muted-foreground text-center py-8">No commands matched &quot;{query}&quot;.</p>
      ) : (
        filtered.map((group) => (
          <section key={group.category} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold">{group.category}</h2>
              <p className="text-sm text-fd-muted-foreground">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.commands.map((cmd) => {
                const content = (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-semibold">{cmd.name}</span>
                      {cmd.href && (
                        <ArrowRight className="size-3.5 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                    <p className="text-sm text-fd-muted-foreground leading-relaxed">{cmd.description}</p>
                  </>
                );

                const className =
                  'group flex flex-col gap-1.5 rounded-xl border border-fd-border bg-fd-card p-4 transition-colors' +
                  (cmd.href ? ' hover:bg-fd-muted/30 hover:border-fd-foreground/20' : '');

                return cmd.href ? (
                  <Link key={cmd.name} href={cmd.href} className={className}>
                    {content}
                  </Link>
                ) : (
                  <div key={cmd.name} className={className}>
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
