// ============================================================
//  Согласие на cookie (152-ФЗ). Выбор посетителя хранится в localStorage.
//  Необязательные скрипты (метрика, пиксели, чаты) подключайте только
//  после hasCookieConsent() === true и повторно проверяйте при
//  изменении выбора через subscribeConsent().
// ============================================================

const STORAGE_KEY = "cookie-consent";
const VERSION = 2;

type Listener = () => void;

const listeners = new Set<Listener>();
let memoryValue: string | null | undefined;
let settingsRequested = false;

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: Listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Сырое значение — строка для useSyncExternalStore (стабильна между вызовами). */
export function getConsentSnapshot(): string | null {
  if (memoryValue !== undefined) return memoryValue;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getSettingsRequestedSnapshot() {
  return settingsRequested;
}

export function parseConsent(raw: string | null): { accepted: boolean } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { version?: number; accepted?: unknown };
    // Версия изменилась (например, появились новые категории) — спрашиваем заново
    if (data.version !== VERSION || typeof data.accepted !== "boolean") return null;
    return { accepted: data.accepted };
  } catch {
    return null;
  }
}

export function hasCookieConsent() {
  return parseConsent(getConsentSnapshot())?.accepted === true;
}

export function saveConsent(accepted: boolean) {
  const value = JSON.stringify({
    version: VERSION,
    accepted,
    savedAt: new Date().toISOString(),
  });
  memoryValue = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Хранилище недоступно — выбор живёт до перезагрузки страницы
  }
  settingsRequested = false;
  emit();
}

/** Открыть окно настроек повторно (ссылка в подвале, отзыв согласия). */
export function openCookieSettings() {
  settingsRequested = true;
  emit();
}

export function closeCookieSettings() {
  settingsRequested = false;
  emit();
}
