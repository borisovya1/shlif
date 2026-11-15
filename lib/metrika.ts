// ============================================================
//  Яндекс Метрика. Скрипт грузится только после согласия на cookie
//  (см. components/analytics/YandexMetrika.tsx). Пока согласия нет,
//  функции отсюда ничего не делают.
// ============================================================

import { site } from "@/lib/site";

type Ym = ((id: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: Ym;
  }
}

export const METRIKA_ID = site.metrikaId;
const TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;

/** Официальный сниппет Метрики, переписанный без eval-строки. */
export function loadMetrika() {
  if (window.ym) return;

  const stub: Ym = (...args) => {
    (stub.a = stub.a || []).push(args);
  };
  stub.l = Date.now();
  window.ym = stub;

  const alreadyLoaded = Array.from(document.scripts).some((s) => s.src === TAG_URL);
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.async = true;
    script.src = TAG_URL;
    document.head.appendChild(script);
  }

  window.ym(METRIKA_ID, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

/** Просмотр страницы при переходе внутри сайта (Next.js не перезагружает страницу). */
export function trackHit(url: string, referer?: string) {
  window.ym?.(METRIKA_ID, "hit", url, referer ? { referer } : undefined);
}

/** Цель в Метрике. Создайте её в настройках счётчика: «JavaScript-событие» с тем же идентификатором. */
export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.ym?.(METRIKA_ID, "reachGoal", goal, params);
}

/** Удалить cookie Метрики после отзыва согласия. */
export function removeMetrikaCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie
    .split(";")
    .map((part) => part.split("=")[0].trim())
    .filter((name) => name.startsWith("_ym"))
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      });
    });
}
