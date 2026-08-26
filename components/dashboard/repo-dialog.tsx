'use client';

import { useRef, useState, useTransition } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Modal, type ModalHandle } from './modal';
import { createRepoAction, updateRepoAction } from '@/lib/dashboard-actions';
import { getChannelsAction } from '@/lib/dashboard-actions';
import type { DashboardChannel } from '@/lib/api';

type Repo = { id: string; repo_name: string; channel_id: string };

export function RepoDialog({
  guildId,
  webhookId,
  mode,
  repo,
}: {
  guildId: string;
  webhookId: string;
  mode: 'create' | 'edit';
  repo?: Repo;
}) {
  const modalRef = useRef<ModalHandle>(null);
  const [ownerName, setOwnerName] = useState(repo?.repo_name ?? '');
  const [channelId, setChannelId] = useState(repo?.channel_id ?? '');
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

    startTransition(async () => {
      if (mode === 'create') {
        const [owner, ...rest] = ownerName.split('/');
        const name = rest.join('/');
        if (!owner || !name) {
          setError('Enter a repo as owner/name, e.g. octocat/Hello-World.');
          return;
        }
        const result = await createRepoAction(guildId, webhookId, owner, name, channelId);
        if (!result.ok) {
          setError(result.error);
          return;
        }
      } else if (repo) {
        const result = await updateRepoAction(guildId, repo.id, {
          repo_name: ownerName,
          channel_id: channelId,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
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
          Add repo
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          aria-label="Edit repo"
          title="Edit repo"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      <Modal ref={modalRef} title={mode === 'create' ? 'Link a repository' : 'Edit repository'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fd-muted-foreground">Repository (owner/name)</span>
            <input
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="octocat/Hello-World"
              className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm font-mono"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fd-muted-foreground">Channel</span>
            <select
              required
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                {channels === null ? 'Loading channels…' : 'Select a channel'}
              </option>
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
              {isPending ? 'Saving…' : mode === 'create' ? 'Add' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
