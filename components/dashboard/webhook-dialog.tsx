'use client';

import { useRef, useState, useTransition } from 'react';
import { Plus, Pencil, KeyRound } from 'lucide-react';
import { Modal, type ModalHandle } from './modal';
import { SecretReveal } from './secret-reveal';
import {
  createWebhookAction,
  updateWebhookAction,
  resetWebhookSecretAction,
} from '@/lib/dashboard-actions';

type Webhook = { id: string; comment: string; broken: boolean };

export function WebhookDialog({
  guildId,
  mode,
  webhook,
}: {
  guildId: string;
  mode: 'create' | 'edit';
  webhook?: Webhook;
}) {
  const modalRef = useRef<ModalHandle>(null);
  const [comment, setComment] = useState(webhook?.comment ?? '');
  const [broken, setBroken] = useState(webhook?.broken ?? false);
  const [error, setError] = useState<string | null>(null);
  const [revealSecret, setRevealSecret] = useState<{ label: string; value: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setError(null);
    setRevealSecret(null);
    if (mode === 'create') {
      setComment('');
      setBroken(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      if (mode === 'create') {
        const result = await createWebhookAction(guildId, comment, broken);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setRevealSecret({ label: 'this secret', value: `${result.data.url}\nSecret: ${result.data.secret}` });
      } else if (webhook) {
        const result = await updateWebhookAction(guildId, webhook.id, { comment, broken });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        modalRef.current?.close();
      }
    });
  }

  function handleResetSecret() {
    if (!webhook) return;
    setError(null);
    startTransition(async () => {
      const result = await resetWebhookSecretAction(guildId, webhook.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRevealSecret({ label: 'this secret', value: result.data.secret });
    });
  }

  return (
    <>
      {mode === 'create' ? (
        <button
          type="button"
          onClick={() => modalRef.current?.open()}
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          New Webhook
        </button>
      ) : (
        <button
          type="button"
          onClick={() => modalRef.current?.open()}
          className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          aria-label="Edit webhook"
          title="Edit webhook"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      <Modal ref={modalRef} title={mode === 'create' ? 'New webhook' : 'Edit webhook'} onClose={reset}>
        {revealSecret ? (
          <SecretReveal
            label={revealSecret.label}
            value={revealSecret.value}
            onDismiss={() => {
              setRevealSecret(null);
              modalRef.current?.close();
            }}
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-fd-muted-foreground">Comment</span>
              <input
                required
                maxLength={200}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Main repo notifications"
                className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={broken} onChange={(e) => setBroken(e.target.checked)} />
              Mark as broken
            </label>

            {mode === 'edit' && webhook && (
              <button
                type="button"
                onClick={handleResetSecret}
                disabled={isPending}
                className="inline-flex items-center gap-2 self-start text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors disabled:opacity-50"
              >
                <KeyRound className="size-3" />
                Reset secret
              </button>
            )}

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
        )}
      </Modal>
    </>
  );
}
