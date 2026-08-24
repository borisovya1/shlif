"use client";

import { useCallback, useMemo, useState } from "react";

import { ModalContext } from "@/components/modals/modal-context";
import LeadForm from "@/components/ui/LeadForm";
import Modal from "@/components/ui/Modal";
import { CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

type ModalKind = "callback" | "success" | null;

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ModalKind>(null);

  const openCallback = useCallback(() => setActive("callback"), []);
  const openSuccess = useCallback(() => setActive("success"), []);
  const close = useCallback(() => setActive(null), []);

  const value = useMemo(
    () => ({ openCallback, openSuccess, close }),
    [openCallback, openSuccess, close],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Modal open={active === "callback"} onClose={close} labelledBy="callback-title">
        <h2 id="callback-title" className="pr-10 text-2xl font-extrabold text-bark-900">
          Обратный звонок
        </h2>
        <p className="mt-2 text-sm text-bark-500">
          Оставьте номер — перезвоним в течение 15 минут и ответим на вопросы.
        </p>

        <LeadForm source="callback" buttonLabel="Жду звонка" className="mt-6" />

        <ul className="mt-6 space-y-2 border-t border-bark-100 pt-5 text-sm text-bark-500">
          {[
            "Работаем по договору",
            "Выезд на замер бесплатно",
            "Гарантия на все виды работ",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 shrink-0 text-copper-500" />
              {item}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={active === "success"} onClose={close} labelledBy="success-title">
        <div className="py-2 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-copper-50 text-copper-500">
            <CheckIcon className="h-8 w-8" strokeWidth={2} />
          </div>
          <h2 id="success-title" className="mt-5 text-2xl font-extrabold text-bark-900">
            Заявка отправлена
          </h2>
          <p className="mt-2 text-bark-500">
            Перезвоним в течение 30 минут. Если вопрос срочный — звоните{" "}
            <a href={site.phone.href} className="font-semibold text-copper-600">
              {site.phone.display}
            </a>
            .
          </p>
          <button type="button" onClick={close} className="btn btn-dark mt-6 w-full">
            Понятно
          </button>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
}
