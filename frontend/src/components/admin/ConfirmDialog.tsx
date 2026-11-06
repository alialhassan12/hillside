import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { secondaryButtonClass } from "./adminClasses";
import { getErrorMessage } from "../../lib/apiErrors";

interface ConfirmDialogProps {
  // The dialog is open while this is true.
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  // Runs the delete. Throwing keeps the dialog open and shows the error.
  onConfirm: () => Promise<void>;
  // Called after cancel, Escape, backdrop click or a successful confirm.
  onClose: () => void;
}

// Native <dialog> confirmation for destructive admin actions.
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  // The element that opened the dialog, to give focus back on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const titleId = useId();
  const descriptionId = useId();

  // Sync the native dialog with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      // Start on Cancel, the safe choice.
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocusRef.current?.focus();
    }
  }, [open]);

  function close() {
    if (isWorking) return;
    setError("");
    onClose();
  }

  async function confirm() {
    setError("");
    setIsWorking(true);
    try {
      await onConfirm();
      setIsWorking(false);
      onClose();
    } catch (confirmError) {
      setIsWorking(false);
      setError(getErrorMessage(confirmError, "Something went wrong. Please try again."));
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // Escape: let React decide, and block it while deleting.
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      // Click on the backdrop (outside the panel) closes.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-stone-200 bg-white p-0 font-sans text-stone-700 shadow-xl backdrop:bg-stone-900/50"
    >
      <div className="flex gap-4 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 size={18} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-base font-semibold text-stone-900">
            {title}
          </h2>
          <div id={descriptionId} className="mt-1 text-sm leading-6 break-words text-stone-600">
            {description}
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:justify-end">
        <button
          ref={cancelRef}
          type="button"
          onClick={close}
          disabled={isWorking}
          className={`${secondaryButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={isWorking}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isWorking ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
