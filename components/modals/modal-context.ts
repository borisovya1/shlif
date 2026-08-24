"use client";

import { createContext, useContext } from "react";

export type ModalContextValue = {
  openCallback: () => void;
  openSuccess: () => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModals(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals должен вызываться внутри ModalProvider");
  }
  return context;
}
