import type { FormEvent, ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "./ui";

/**
 * A confirmation dialog that can hold a few form fields (a reason, a date).
 * The confirm button submits the form, so Enter works and required fields
 * are checked by the browser.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  variant = "primary",
  loading = false,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  variant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/50" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl focus:outline-none">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <DialogPrimitive.Title className="text-xl font-extrabold text-ink-900">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Close
                className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-brand-50"
                aria-label="Close"
                disabled={loading}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description className="text-base leading-relaxed text-ink-500">
              {description}
            </DialogPrimitive.Description>
            {children}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant={variant} loading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
