'use client';

import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalHandle {
  open: () => void;
  close: () => void;
}

// A native <dialog>-based modal — real modal semantics (focus trap, ESC to
// close, ::backdrop) with zero new dependencies, rather than pulling in a full
// dialog library for a handful of small forms.
export const Modal = forwardRef<ModalHandle, { title: string; children: ReactNode; onClose?: () => void }>(
  function Modal({ title, children, onClose }, ref) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    return (
      <dialog
        ref={dialogRef}
        onClose={onClose}
        className="rounded-xl border border-fd-border bg-fd-popover text-fd-popover-foreground p-0 w-full max-w-md backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-fd-border">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </dialog>
    );
  },
);
