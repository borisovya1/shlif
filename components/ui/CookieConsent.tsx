"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  closeCookieSettings,
  getConsentSnapshot,
  getSettingsRequestedSnapshot,
  parseConsent,
  saveConsent,
  subscribeConsent,
} from "@/lib/cookie-consent";

// На сервере решение неизвестно — баннер не рендерим, чтобы не мигал у тех, кто уже выбрал
const getServerConsent = () => undefined;
const getServerRequested = () => false;

export default function CookieConsent() {
  const raw = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsent);
  const requested = useSyncExternalStore(
    subscribeConsent,
    getSettingsRequestedSnapshot,
    getServerRequested,
  );

  const saved = parseConsent(raw ?? null);
  const visible = raw !== undefined && (saved === null || requested);
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Использование файлов cookie"
      className="animate-fade-up fixed inset-x-3 bottom-3 z-40 sm:right-auto sm:bottom-5 sm:left-5 sm:w-[26rem] lg:bottom-6 lg:left-6"
    >
      <div className="rounded-2xl border border-bark-200 bg-bark-50/95 p-5 shadow-xl shadow-bark-900/15 backdrop-blur-md">
        <p className="text-base font-bold text-bark-900">Мы используем файлы cookie</p>
        <p className="mt-2 text-sm leading-relaxed text-bark-600">
          С вашего согласия мы подключаем Яндекс Метрику: она собирает статистику посещений и
          действий на страницах, чтобы мы делали сайт удобнее. Если откажетесь, Метрика не
          загружается, а сайт работает как обычно. Выбор можно изменить в любой момент по ссылке
          «Настройки cookie» внизу страницы. Подробнее — в{" "}
          <Link
            href="/politika/#cookie"
            className="font-semibold text-copper-600 underline underline-offset-2 hover:text-copper-700"
          >
            политике конфиденциальности
          </Link>
          .
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => saveConsent(false)}
            className="btn btn-outline px-3 py-2.5 text-sm"
          >
            Отказаться
          </button>
          <button
            type="button"
            onClick={() => saveConsent(true)}
            className="btn btn-primary px-3 py-2.5 text-sm"
          >
            Принять
          </button>
        </div>

        {requested ? (
          <button
            type="button"
            onClick={closeCookieSettings}
            className="mt-3 w-full text-center text-xs font-semibold text-bark-500 transition hover:text-bark-900"
          >
            Закрыть без изменений
          </button>
        ) : null}
      </div>
    </div>
  );
}
