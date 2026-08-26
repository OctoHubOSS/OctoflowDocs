'use client';

import { TriangleAlert } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';

export function SecretReveal({
  label,
  value,
  onDismiss,
}: {
  label: string;
  value: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-start gap-2 text-sm">
        <TriangleAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Copy this now</strong> — you won&apos;t be able to see {label} again after you close this.
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg bg-fd-muted px-3 py-2">
        <code className="text-xs font-mono break-all">{value}</code>
        <CopyButton value={value} />
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="self-end rounded-lg border border-fd-border px-3 py-1.5 text-xs font-medium hover:bg-fd-muted transition-colors"
      >
        Done, I copied it
      </button>
    </div>
  );
}
