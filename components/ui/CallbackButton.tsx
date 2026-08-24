"use client";

import { useModals } from "@/components/modals/modal-context";

type CallbackButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function CallbackButton({
  children,
  className = "btn btn-primary",
}: CallbackButtonProps) {
  const { openCallback } = useModals();

  return (
    <button type="button" onClick={openCallback} className={className}>
      {children}
    </button>
  );
}
