"use client";

import { useEffect, type ReactNode } from "react";

import { CloseIcon } from "@/components/ui/icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  size?: "sm" | "lg";
};

export default function Modal({
  open,
  onClose,
  children,
  labelledBy,
  size = "sm",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-bark-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`animate-fade-up relative w-full rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8 ${
          size === "lg" ? "max-w-3xl" : "max-w-md"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full text-bark-500 transition hover:bg-bark-100 hover:text-bark-900"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
