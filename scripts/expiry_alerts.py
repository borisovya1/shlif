#!/usr/bin/env python3
"""Письма за 7, 3 и 1 день до конца сертификата, доменов и оплаты сервера.

Запуск по cron раз в сутки. Повторно за тот же порог и ту же дату не шлёт.
Дата сервера лежит в /etc/shlif-alerts/server-expires (ГГГГ-ММ-ДД): её неоткуда
взять автоматически, после продления VPS файл нужно обновить.
"""

from __future__ import annotations

import json
import re
import smtplib
import ssl
import subprocess
import sys
from dataclasses import dataclass
from datetime import date, datetime
from email.message import EmailMessage
from pathlib import Path
from zoneinfo import ZoneInfo

THRESHOLDS = (7, 3, 1)
MOSCOW = ZoneInfo("Europe/Moscow")

ENV_FILE = Path("/var/www/shlif/.env")
CERT_FILE = Path("/etc/letsencrypt/live/doctor-shlif.ru/fullchain.pem")
SERVER_EXPIRES_FILE = Path("/etc/shlif-alerts/server-expires")
STATE_FILE = Path("/var/lib/shlif-alerts/state.json")

DOMAINS = (
    "doctor-shlif.ru",
    "doktor-shlif.ru",
    "xn----gtbnggpbqqz5b.xn--p1ai",
)


@dataclass(frozen=True)
class Item:
    kind: str
    name: str
    expires: date
    detail: str


def today_moscow() -> date:
    return datetime.now(MOSCOW).date()


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def parse_cert_expiry(path: Path) -> date:
    result = subprocess.run(
        ["openssl", "x509", "-enddate", "-noout", "-in", str(path)],
        check=True,
        capture_output=True,
        text=True,
        timeout=20,
    )
    raw = result.stdout.strip().split("=", 1)[1].removesuffix(" GMT").strip()
    expires = datetime.strptime(raw, "%b %d %H:%M:%S %Y").replace(tzinfo=ZoneInfo("UTC"))
    return expires.astimezone(MOSCOW).date()


def display_domain(name: str) -> str:
    try:
        return name.encode("ascii").decode("idna")
    except UnicodeError:
        return name


def parse_whois_expiry(domain: str) -> date:
    result = subprocess.run(
        ["whois", domain],
        check=True,
        capture_output=True,
        text=True,
        timeout=40,
    )
    match = re.search(r"^paid-till:\s*(\d{4}-\d{2}-\d{2})", result.stdout, re.M)
    if not match:
        raise RuntimeError(f"в whois {domain} нет paid-till")
    return date.fromisoformat(match.group(1))


def parse_server_expiry(path: Path) -> date:
    text = ""
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#"):
            text = line
            break
    if not text:
        raise RuntimeError(f"пустой файл {path}")
    return date.fromisoformat(text)


def collect_items() -> list[Item]:
    items: list[Item] = []
    cert_day = parse_cert_expiry(CERT_FILE)
    items.append(
        Item(
            kind="Сертификат",
            name="doctor-shlif.ru",
            expires=cert_day,
            detail="Один сертификат Let's Encrypt на doctor-shlif.ru, doktor-shlif.ru и доктор-шлиф.рф.",
        )
    )
    for domain in DOMAINS:
        items.append(
            Item(
                kind="Домен",
                name=display_domain(domain),
                expires=parse_whois_expiry(domain),
                detail="Дата paid-till из whois.",
            )
        )
    items.append(
        Item(
            kind="Сервер",
            name="152.228.116.200",
            expires=parse_server_expiry(SERVER_EXPIRES_FILE),
            detail="Дата следующего платежа в AdminVPS. После оплаты обновите /etc/shlif-alerts/server-expires.",
        )
    )
    return items


def due_alerts(items: list[Item], today: date) -> list[tuple[Item, int]]:
    alerts: list[tuple[Item, int]] = []
    for item in items:
        days_left = (item.expires - today).days
        if days_left in THRESHOLDS:
            alerts.append((item, days_left))
    return alerts


def state_key(item: Item, days_left: int) -> str:
    return f"{item.kind}|{item.name}|{item.expires.isoformat()}|{days_left}"


def load_state() -> set[str]:
    if not STATE_FILE.exists():
        return set()
    data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return set(data.get("sent", []))


def save_state(sent: set[str]) -> None:
    STATE_FILE.parent.mkdir(parents=True, mode=0o755, exist_ok=True)
    STATE_FILE.write_text(
        json.dumps({"sent": sorted(sent)}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def recipients(env: dict[str, str]) -> list[str]:
    raw = env.get("LEAD_MAIL_TO", "")
    people = [part.strip() for part in raw.split(",") if part.strip()]
    if not people:
        raise RuntimeError("LEAD_MAIL_TO пустой")
    return people


def send_mail(env: dict[str, str], subject: str, body: str) -> None:
    host = env["SMTP_HOST"]
    port = int(env.get("SMTP_PORT") or "465")
    user = env["SMTP_USER"]
    password = env["SMTP_PASS"]
    sender = env.get("SMTP_FROM") or user
    secure = env.get("SMTP_SECURE", "true").lower() != "false"
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = ", ".join(recipients(env))
    message.set_content(body)

    if secure:
        with smtplib.SMTP_SSL(host, port, timeout=30, context=ssl.create_default_context()) as smtp:
            smtp.login(user, password)
            smtp.send_message(message)
        return

    with smtplib.SMTP(host, port, timeout=30) as smtp:
        smtp.ehlo()
        smtp.starttls(context=ssl.create_default_context())
        smtp.ehlo()
        smtp.login(user, password)
        smtp.send_message(message)


def format_alert(item: Item, days_left: int) -> tuple[str, str]:
    when = item.expires.strftime("%d.%m.%Y")
    day_word = "день" if days_left == 1 else "дня" if days_left in (2, 3, 4) else "дней"
    subject = f"[Доктор Шлиф] {item.kind} {item.name} истекает через {days_left} {day_word}"
    body = (
        f"{item.kind}: {item.name}\n"
        f"Дата окончания: {when}\n"
        f"Осталось: {days_left} {day_word}\n\n"
        f"{item.detail}\n"
    )
    return subject, body


def format_report(items: list[Item], today: date) -> tuple[str, str]:
    lines = [f"Проверка сроков включена. Сегодня {today.strftime('%d.%m.%Y')}.", ""]
    for item in items:
        days_left = (item.expires - today).days
        lines.append(f"{item.kind} {item.name}: {item.expires.strftime('%d.%m.%Y')} (через {days_left} дн.)")
    lines.append("")
    lines.append("Письма придут за 7 дней, за 3 дня и за 1 день.")
    lines.append("Получатель — адрес из LEAD_MAIL_TO.")
    return "[Доктор Шлиф] Оповещения о сроках включены", "\n".join(lines) + "\n"


def main() -> int:
    report = "--report" in sys.argv
    dry_run = "--dry-run" in sys.argv
    env = load_env(ENV_FILE)
    items = collect_items()
    today = today_moscow()

    if report:
        subject, body = format_report(items, today)
        print(subject)
        print(body, end="")
        if not dry_run:
            send_mail(env, subject, body)
        return 0

    alerts = due_alerts(items, today)
    sent = load_state()
    pending = [(item, days) for item, days in alerts if state_key(item, days) not in sent]
    if not pending:
        print(f"{today.isoformat()} нечего отправлять")
        return 0

    for item, days_left in pending:
        subject, body = format_alert(item, days_left)
        print(subject)
        if dry_run:
            continue
        send_mail(env, subject, body)
        sent.add(state_key(item, days_left))
        save_state(sent)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ошибка: {error}", file=sys.stderr)
        raise SystemExit(1)
