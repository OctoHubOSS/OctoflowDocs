'use client';

import { useRef, useState, useTransition } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Modal, type ModalHandle } from './modal';
import { createModifierAction, updateModifierAction, getChannelsAction } from '@/lib/dashboard-actions';
import type { DashboardChannel, DashboardRepo } from '@/lib/api';

type Modifier = {
  id: string;
  events: string[];
  blacklisted: boolean;
  whitelisted: boolean;
  priority: number;
  repo_id?: string;
  redirect_channel?: string;
};

export function ModifierDialog({
  guildId,
  webhookId,
  mode,
  modifier,
  repos,
}: {
  guildId: string;
  webhookId: string;
  mode: 'create' | 'edit';
  modifier?: Modifier;
  repos: DashboardRepo[];
}) {
  const modalRef = useRef<ModalHandle>(null);
  const [events, setEvents] = useState(modifier?.events.join(', ') ?? '');
  const [blacklisted, setBlacklisted] = useState(modifier?.blacklisted ?? false);
  const [whitelisted, setWhitelisted] = useState(modifier?.whitelisted ?? false);
  const [priority, setPriority] = useState(modifier?.priority ?? 0);
  const [repoId, setRepoId] = useState(modifier?.repo_id ?? '');
  const [redirectChannel, setRedirectChannel] = useState(modifier?.redirect_channel ?? '');
  const [channels, setChannels] = useState<DashboardChannel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleOpen() {
    modalRef.current?.open();
    if (channels === null) {
      const result = await getChannelsAction(guildId);
      setChannels(result ?? []);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const fields = {
      events,
      blacklisted,
      whitelisted,
      priority,
      repo_id: repoId || undefined,
      redirect_channel: redirectChannel || undefined,
    };

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createModifierAction(guildId, webhookId, fields)
          : modifier
            ? await updateModifierAction(guildId, modifier.id, fields)
            : null;

      if (!result || !result.ok) {
        setError(result ? result.error : 'Something went wrong.');
        return;
      }
      modalRef.current?.close();
    });
  }

  return (
    <>
      {mode === 'create' ? (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          <Plus className="size-3.5" />
          Add modifier
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          aria-label="Edit modifier"
          title="Edit modifier"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      <Modal ref={modalRef} title={mode === 'create' ? 'New event modifier' : 'Edit event modifier'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fd-muted-foreground">Events (comma or space-separated)</span>
            <input
              required
              value={events}
              onChange={(e) => setEvents(e.target.value)}
              placeholder="push, pull_request"
              className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm font-mono"
            />
            <span className="text-xs text-fd-muted-foreground">Supports * and ? wildcards, e.g. workflow_*</span>
          </label>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={blacklisted} onChange={(e) => setBlacklisted(e.target.checked)} />
              Blacklist
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={whitelisted} onChange={(e) => setWhitelisted(e.target.checked)} />
              Whitelist
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fd-muted-foreground">Priority</span>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fd-muted-foreground">Limit to repo (optional)</span>
            <select
              value={repoId}
              onChange={(e) => setRepoId(e.target.value)}
              className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            >
              <option value="">All repos on this webhook</option>
              {repos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.repo_name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fd-muted-foreground">Redirect channel (optional)</span>
            <select
              value={redirectChannel}
              onChange={(e) => setRedirectChannel(e.target.value)}
              className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            >
              <option value="">No redirect</option>
              {channels?.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.name}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => modalRef.current?.close()}
              className="rounded-lg border border-fd-border px-4 py-2 text-sm font-medium hover:bg-fd-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
