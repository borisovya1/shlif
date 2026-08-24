export type Lead = {
  /** Телефон в виде, который ввёл пользователь */
  phone: string;
  name?: string;
  comment?: string;
  /** Откуда пришла заявка: quiz, contacts, callback */
  source: string;
  /** Ответы квиза, если заявка из него */
  details?: Record<string, string>;
  /** Honeypot: люди это поле не видят, боты заполняют */
  company?: string;
};

/**
 * Отправляет заявку на серверный маршрут /api/lead, который уже пишет в Telegram.
 * Токен бота живёт только в переменных окружения на сервере и в браузер не попадает.
 */
export async function submitLead(lead: Lead): Promise<void> {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Не удалось отправить заявку");
  }
}
