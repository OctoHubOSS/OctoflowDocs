import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Hash, Filter } from 'lucide-react';
import { getSession } from '@/lib/session';
import { getDashboardGuild, type DashboardWebhook } from '@/lib/api';
import { deleteWebhookAction, deleteRepoAction, deleteModifierAction } from '@/lib/dashboard-actions';
import { WebhookDialog } from '@/components/dashboard/webhook-dialog';
import { RepoDialog } from '@/components/dashboard/repo-dialog';
import { ModifierDialog } from '@/components/dashboard/modifier-dialog';
import { ConfirmDelete } from '@/components/dashboard/confirm-delete';
import { CopyButton } from '@/components/copy-button';

export const metadata: Metadata = {
  title: 'Server Dashboard',
  description: 'Webhooks, repos, and event modifiers for this server.',
};

export const revalidate = 0;

export default async function GuildDashboardPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/dashboard');
  }

  // Defense in depth: don't trust the URL, only show a guild the session says
  // this Discord user actually manages.
  const guild = session.guilds.find((g) => g.id === guildId);
  if (!guild) {
    redirect('/dashboard');
  }

  const webhooks = await getDashboardGuild(guildId);

  return (
    <main className="flex flex-1 flex-col px-4 py-20 max-w-3xl mx-auto w-full gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" />
          All servers
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{guild.name}</h1>
          <WebhookDialog guildId={guildId} mode="create" />
        </div>
      </div>

      {webhooks === null && (
        <div className="rounded-xl border border-fd-border bg-fd-card px-6 py-4 text-sm text-fd-muted-foreground">
          Couldn&apos;t load this server&apos;s configuration right now. Try again shortly.
        </div>
      )}

      {webhooks !== null && webhooks.length === 0 && (
        <div className="rounded-xl border border-fd-border bg-fd-card px-6 py-8 text-center text-sm text-fd-muted-foreground">
          No webhooks yet in this server. Use the &quot;New Webhook&quot; button above to create one.
        </div>
      )}

      {webhooks !== null && webhooks.length > 0 && (
        <div className="flex flex-col gap-6">
          {webhooks.map((webhook) => (
            <WebhookCard key={webhook.id} guildId={guildId} webhook={webhook} />
          ))}
        </div>
      )}
    </main>
  );
}

function WebhookCard({ guildId, webhook }: { guildId: string; webhook: DashboardWebhook }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4 border-b border-fd-border">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold break-words">{webhook.comment || 'Untitled webhook'}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-fd-muted-foreground font-mono break-all">{webhook.id}</span>
            <CopyButton value={webhook.id} />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {webhook.broken && (
            <span className="text-xs font-medium px-2 py-1 rounded-full text-white bg-red-500/90">Broken</span>
          )}
          <WebhookDialog guildId={guildId} mode="edit" webhook={webhook} />
          <ConfirmDelete
            itemLabel="webhook"
            action={async () => {
              'use server';
              const result = await deleteWebhookAction(guildId, webhook.id);
              return result.ok ? { ok: true } : { ok: false, error: result.error };
            }}
          />
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground flex items-center gap-1.5">
            <Hash className="size-3.5" />
            Repositories ({webhook.repos.length})
          </h3>
          <RepoDialog guildId={guildId} webhookId={webhook.id} mode="create" />
        </div>
        {webhook.repos.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No repositories linked yet.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {webhook.repos.map((repo) => (
              <li key={repo.id} className="text-sm flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 break-words">
                  <span className="font-mono">{repo.repo_name}</span>
                  <span className="text-fd-muted-foreground"> → #{repo.channel_name ?? repo.channel_id}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <RepoDialog guildId={guildId} webhookId={webhook.id} mode="edit" repo={repo} />
                  <ConfirmDelete
                    itemLabel="repository"
                    action={async () => {
                      'use server';
                      const result = await deleteRepoAction(guildId, repo.id);
                      return result.ok ? { ok: true } : { ok: false, error: result.error };
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-6 py-4 border-t border-fd-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground flex items-center gap-1.5">
            <Filter className="size-3.5" />
            Event Modifiers ({webhook.event_modifiers.length})
          </h3>
          <ModifierDialog guildId={guildId} webhookId={webhook.id} mode="create" repos={webhook.repos} />
        </div>
        {webhook.event_modifiers.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No event modifiers on this webhook.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {webhook.event_modifiers.map((mod) => (
              <li key={mod.id} className="text-sm flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span>
                    {mod.whitelisted ? 'Whitelist' : mod.blacklisted ? 'Blacklist' : 'No-op'}
                    {mod.redirect_channel ? `, redirect → #${mod.redirect_channel_name ?? mod.redirect_channel}` : ''}
                    {` (priority ${mod.priority})`}
                  </span>
                  <span className="text-fd-muted-foreground font-mono text-xs break-words">{mod.events.join(', ')}</span>
                </div>
                <span className="flex items-center gap-2 shrink-0">
                  <ModifierDialog
                    guildId={guildId}
                    webhookId={webhook.id}
                    mode="edit"
                    modifier={mod}
                    repos={webhook.repos}
                  />
                  <ConfirmDelete
                    itemLabel="event modifier"
                    action={async () => {
                      'use server';
                      const result = await deleteModifierAction(guildId, mod.id);
                      return result.ok ? { ok: true } : { ok: false, error: result.error };
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
