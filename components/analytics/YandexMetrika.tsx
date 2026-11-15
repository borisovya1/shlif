"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { getConsentSnapshot, parseConsent, subscribeConsent } from "@/lib/cookie-consent";
import { loadMetrika, removeMetrikaCookies, trackHit } from "@/lib/metrika";

const getServerConsent = () => null;

/**
 * Подключает Яндекс Метрику только после нажатия «Принять» в окне cookie.
 * Отказ — скрипт не загружается. Отзыв согласия — cookie Метрики удаляются,
 * страница перезагружается, и скрипт больше не подключается.
 */
export default function YandexMetrika() {
  const raw = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsent);
  const accepted = parseConsent(raw)?.accepted === true;
  const pathname = usePathname();

  const loaded = useRef(false);
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (accepted && !loaded.current) {
      loadMetrika();
      loaded.current = true;
      lastUrl.current = location.href;
    } else if (!accepted && loaded.current) {
      removeMetrikaCookies();
      location.reload();
    }
  }, [accepted]);

  useEffect(() => {
    if (!loaded.current) return;
    const url = location.href;
    if (url === lastUrl.current) return;
    trackHit(url, lastUrl.current ?? undefined);
    lastUrl.current = url;
  }, [pathname]);

  return null;
}
