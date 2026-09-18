"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { useModals } from "@/components/modals/modal-context";
import { formatPhone, isPhoneComplete } from "@/lib/phone";
import { submitLead } from "@/lib/submitLead";

type LeadFormProps = {
  source: string;
  buttonLabel?: string;
  className?: string;
  tone?: "light" | "dark";
  withName?: boolean;
  details?: Record<string, string>;
};

export default function LeadForm({
  source,
  buttonLabel = "Отправить заявку",
  className = "",
  tone = "light",
  withName = false,
  details,
}: LeadFormProps) {
  const { openSuccess } = useModals();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isDark = tone === "dark";

  const fieldClass = [
    "w-full rounded-full border px-5 py-3.5 text-base outline-none transition",
    isDark
      ? "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-copper-300"
      : "border-bark-200 bg-white text-bark-900 placeholder:text-bark-400 focus:border-copper-400",
  ].join(" ");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPhoneComplete(phone)) {
      setError("Введите номер телефона полностью");
      return;
    }

    if (!consent) {
      setError("Отметьте согласие на обработку персональных данных");
      return;
    }

    setError(null);
    setPending(true);

    try {
      await submitLead({
        phone,
        name: name || undefined,
        source,
        details,
        consent,
        company: company || undefined,
      });
      setPhone("");
      setName("");
      setConsent(false);
      openSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить заявку. Позвоните нам — мы на связи.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <input
        type="text"
        name="company"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-3">
        {withName ? (
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ваше имя"
            autoComplete="name"
            className={fieldClass}
          />
        ) : null}

        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.target.value))}
          onFocus={() => {
            if (!phone) setPhone("+7 (");
          }}
          placeholder="+7 (___) ___-__-__"
          autoComplete="tel"
          aria-label="Телефон"
          aria-invalid={Boolean(error)}
          className={fieldClass}
        />

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary shrink-0 disabled:opacity-60"
        >
          {pending ? "Отправляем…" : buttonLabel}
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <label
        className={`mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed ${
          isDark ? "text-white/60" : "text-bark-500"
        }`}
      >
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            if (event.target.checked) setError(null);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-copper-500"
        />
        <span>
          Я даю{" "}
          <Link
            href="/soglasie/"
            target="_blank"
            className="underline underline-offset-2 hover:text-copper-400"
          >
            согласие на обработку персональных данных
          </Link>{" "}
          и ознакомлен(а) с{" "}
          <Link
            href="/politika/"
            target="_blank"
            className="underline underline-offset-2 hover:text-copper-400"
          >
            политикой обработки данных
          </Link>
          .
        </span>
      </label>
    </form>
  );
}
