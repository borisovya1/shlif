import { NextResponse } from "next/server";

import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/** Визуальный разделитель между заявками в ленте бота */
const SEPARATOR = "━━━━━━━━━━━━━━━━━━━";

/** Простое ограничение частоты в памяти процесса: защита от спама формами */
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  recent.push(now);
  requestLog.set(ip, recent);

  if (requestLog.size > 5000) requestLog.clear();

  return recent.length > RATE_LIMIT_MAX;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function asText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const sourceLabels: Record<string, string> = {
  quiz: "Квиз на главной",
  contacts: "Форма в блоке «Контакты»",
  callback: "Модальное окно «Обратный звонок»",
};

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[lead] Не заданы TELEGRAM_BOT_TOKEN и/или TELEGRAM_CHAT_ID");
    return NextResponse.json({ error: "Форма временно недоступна" }, { status: 500 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Слишком много заявок. Попробуйте позже или позвоните нам." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // Honeypot: поле скрыто от людей, но боты его заполняют
  if (asText(payload.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const phone = asText(payload.phone, 32);
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 11) {
    return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
  }

  const name = asText(payload.name, 100);
  const comment = asText(payload.comment, 1000);
  const source = asText(payload.source, 40);

  const details =
    payload.details && typeof payload.details === "object"
      ? Object.entries(payload.details as Record<string, unknown>)
          .map(([key, value]) => [asText(key, 60), asText(value, 300)] as const)
          .filter(([key, value]) => key && value)
      : [];

  const receivedAt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const lines = [
    SEPARATOR,
    `🔔 <b>НОВАЯ ЗАЯВКА — ${escapeHtml(site.name.toUpperCase())}</b>`,
    SEPARATOR,
    "",
    `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
  ];

  if (name) lines.push(`👤 <b>Имя:</b> ${escapeHtml(name)}`);
  if (comment) lines.push(`💬 <b>Комментарий:</b> ${escapeHtml(comment)}`);

  if (details.length) {
    lines.push("");
    for (const [key, value] of details) {
      lines.push(`▪️ <b>${escapeHtml(key)}:</b> ${escapeHtml(value)}`);
    }
  }

  lines.push(
    "",
    SEPARATOR,
    `<i>${escapeHtml(sourceLabels[source] ?? source ?? "Сайт")} · ${receivedAt} МСК</i>`,
  );

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[lead] Telegram ответил ошибкой:", await response.text());
      return NextResponse.json({ error: "Не удалось отправить заявку" }, { status: 502 });
    }
  } catch (error) {
    console.error("[lead] Ошибка запроса к Telegram:", error);
    return NextResponse.json({ error: "Не удалось отправить заявку" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
