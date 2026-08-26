'use client';

import { useRef, useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, type ModalHandle } from './modal';

export function ConfirmDelete({
  itemLabel,
  action,
}: {
  itemLabel: string;
  action: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const modalRef = useRef<ModalHandle>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong.');
        return;
      }
      modalRef.current?.close();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => modalRef.current?.open()}
        className="text-fd-muted-foreground hover:text-red-500 transition-colors"
        aria-label={`Delete ${itemLabel}`}
        title={`Delete ${itemLabel}`}
      >
        <Trash2 className="size-3.5" />
      </button>

      <Modal ref={modalRef} title={`Delete ${itemLabel}?`}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fd-muted-foreground">
            This can&apos;t be undone. Anything routed through it will stop working immediately.
          </p>
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
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
