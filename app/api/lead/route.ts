import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

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

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const to = process.env.LEAD_MAIL_TO?.trim();
  const port = Number(process.env.SMTP_PORT || 465);

  if (!host || !user || !pass || !to || Number.isNaN(port)) {
    return null;
  }

  const secure =
    process.env.SMTP_SECURE === "false" ? false : process.env.SMTP_SECURE === "true" || port === 465;

  return {
    host,
    port,
    secure,
    user,
    pass,
    to,
    from: process.env.SMTP_FROM?.trim() || user,
  };
}

export async function POST(request: Request) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    console.error("[lead] Не заданы SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS или LEAD_MAIL_TO");
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
  const sourceLabel = sourceLabels[source] ?? source ?? "Сайт";

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

  const textLines = [
    `Новая заявка — ${site.name}`,
    "",
    `Телефон: ${phone}`,
  ];

  if (name) textLines.push(`Имя: ${name}`);
  if (comment) textLines.push(`Комментарий: ${comment}`);
  for (const [key, value] of details) {
    textLines.push(`${key}: ${value}`);
  }
  textLines.push("", `${sourceLabel} · ${receivedAt} МСК`);

  const htmlRows = [
    `<p><b>Телефон:</b> ${escapeHtml(phone)}</p>`,
  ];
  if (name) htmlRows.push(`<p><b>Имя:</b> ${escapeHtml(name)}</p>`);
  if (comment) htmlRows.push(`<p><b>Комментарий:</b> ${escapeHtml(comment)}</p>`);
  for (const [key, value] of details) {
    htmlRows.push(`<p><b>${escapeHtml(key)}:</b> ${escapeHtml(value)}</p>`);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: `"${site.name}" <${smtp.from}>`,
      to: smtp.to,
      subject: `Заявка с сайта: ${phone}`,
      text: textLines.join("\n"),
      html: `
        <h2>Новая заявка — ${escapeHtml(site.name)}</h2>
        ${htmlRows.join("")}
        <p><i>${escapeHtml(sourceLabel)} · ${escapeHtml(receivedAt)} МСК</i></p>
      `,
    });
  } catch (error) {
    console.error("[lead] Ошибка отправки почты:", error);
    return NextResponse.json({ error: "Не удалось отправить заявку" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
