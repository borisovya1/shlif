# ДокторШлиф — сайт по отделке деревянных домов

Лендинг + страницы услуг на Next.js 16 (App Router, TypeScript, Tailwind CSS v4).
Заявки из форм уходят в Telegram через серверный маршрут `/api/lead` — токен бота
хранится в переменных окружения на сервере и в браузер не попадает.

## Быстрый старт

```bash
yarn install
yarn dev      # http://localhost:3001
```

Чтобы формы работали локально, создайте файл `.env` (см. `.env.example`):

```
TELEGRAM_BOT_TOKEN=123456:AA...
TELEGRAM_CHAT_ID=123456789
```

Продакшен-сборка локально:

```bash
yarn build
yarn start    # http://localhost:3001
```

## Что где лежит

| Путь | Что внутри |
| --- | --- |
| `lib/site.ts` | Название, телефон, email, адрес, регион, домен — **правьте в первую очередь** |
| `lib/services.ts` | Все услуги: тексты, состав работ, вложенность, пункты меню |
| `lib/content.ts` | Проекты, «до/после», отзывы, FAQ, этапы, преимущества |
| `app/api/lead/route.ts` | Приём заявок и отправка в Telegram |
| `lib/submitLead.ts` | Клиентская часть отправки формы |
| `app/page.tsx` | Порядок секций на главной |
| `components/sections/` | Секции лендинга |
| `app/uslugi/[slug]/` | Страница услуги, генерируется из `lib/services.ts` |
| `ecosystem.config.cjs` | Конфигурация PM2 для сервера |
| `.github/workflows/deploy.yml` | CI и автодеплой |

## Заявки в Telegram

1. Создайте бота у [@BotFather](https://t.me/BotFather) → получите `TELEGRAM_BOT_TOKEN`.
2. Узнайте `TELEGRAM_CHAT_ID`: напишите боту, затем откройте
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и возьмите `chat.id`.
   Для группы — добавьте бота в группу и возьмите её отрицательный id.
3. Пропишите обе переменные в `.env` (локально) и на сервере.

Что уже сделано в коде: проверка номера, honeypot против ботов, ограничение
до 5 заявок с одного IP за 10 минут, экранирование текста перед отправкой.

## Как подставить свои фотографии

Сейчас вместо фото рисуются фирменные заглушки. Чтобы поставить реальные снимки:

1. Положите файлы в `public/images/`.
2. Передайте путь в компонент `Photo`: `<Photo src="/images/dom-1.jpg" alt="..." />`.
   Для портфолио добавьте поле `src` в объект проекта в `lib/content.ts`.

Оптимизацию изображений делает сам Next.js (пакет `sharp` уже в зависимостях),
поэтому исходники можно загружать в хорошем качестве.

---

# Развёртывание на сервере

Итоговая схема:

```
браузер → nginx (443, HTTPS) → Next.js (localhost:3001, PM2) → Telegram API
```

## Шаг 1. Сервер

Возьмите VPS с Ubuntu 22.04 или 24.04, минимум 2 ГБ RAM (на 1 ГБ сборка может
падать по памяти — тогда добавьте swap). Направьте A-запись домена на IP сервера.

Зайдите по SSH и создайте рабочего пользователя:

```bash
ssh root@IP_СЕРВЕРА
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Файрвол:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Дальше работаем под `deploy`: `ssh deploy@IP_СЕРВЕРА`.

## Шаг 2. Node.js, Yarn, PM2

Ставим Node через NodeSource — так `node` и `yarn` доступны и в обычной сессии,
и при заходе по SSH из GitHub Actions:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git
sudo corepack enable
sudo npm install -g pm2
node -v && yarn -v && pm2 -v
```

## Шаг 3. Код на сервере

```bash
sudo mkdir -p /var/www/shlif
sudo chown -R deploy:deploy /var/www/shlif
git clone https://github.com/ВАШ_АККАУНТ/shlif.git /var/www/shlif
cd /var/www/shlif
yarn install --immutable
```

Секреты — только на сервере:

```bash
nano /var/www/shlif/.env
```

```
TELEGRAM_BOT_TOKEN=123456:AA...
TELEGRAM_CHAT_ID=123456789
PORT=3001
```

Сборка и запуск:

```bash
yarn build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # выполните команду, которую он напечатает
```

Проверка: `curl -I http://127.0.0.1:3001` — должен вернуться `200 OK`.

## Шаг 4. nginx и HTTPS

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo nano /etc/nginx/sites-available/shlif
```

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/shlif /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Certbot сам добавит HTTPS и редирект с 80 порта. После этого пропишите домен
в `lib/site.ts` (`url`) — от него строятся canonical, sitemap и robots.

## Шаг 5. Автодеплой через GitHub Actions

Workflow уже лежит в `.github/workflows/deploy.yml`. Он делает две вещи:
на каждый push и pull request прогоняет линтер, проверку типов и сборку,
а на push в `main` дополнительно заходит на сервер и обновляет сайт.

### Ключ для доступа

На **сервере** создайте отдельный ключ для деплоя:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy      # это приватный ключ — скопируйте целиком
```

### Секреты в GitHub

Settings → Secrets and variables → Actions → New repository secret:

| Имя | Значение |
| --- | --- |
| `SSH_HOST` | IP сервера |
| `SSH_USER` | `deploy` |
| `SSH_KEY` | содержимое `~/.ssh/github_deploy` целиком, вместе со строками BEGIN/END |
| `SSH_PORT` | `22` (можно не задавать) |
| `DEPLOY_PATH` | `/var/www/shlif` |

Там же, на вкладке **Variables**, создайте переменную `DEPLOY_ENABLED` со значением `true`.
Пока её нет, job деплоя пропускается — это позволяет держать CI зелёным, пока сервер не готов.

### Как это работает дальше

```bash
git add .
git commit -m "Правки текстов"
git push
```

GitHub прогоняет проверки, затем на сервере выполняет
`git reset --hard origin/main` → `yarn install` → `yarn build` → `pm2 reload`.
Через 1–2 минуты изменения на сайте.

> `git reset --hard` затирает локальные правки в `/var/www/shlif`.
> Правьте код только у себя и через git — на сервере руками ничего не меняйте.
> Файл `.env` не в репозитории, поэтому он не пострадает.

### Ручной деплой, если нужен

```bash
cd /var/www/shlif
git pull
yarn install --immutable
yarn build
pm2 reload ecosystem.config.cjs --update-env
```

## Полезные команды на сервере

```bash
pm2 status                    # состояние процесса
pm2 logs doktor-shlif         # логи, в том числе ошибки отправки заявок
pm2 restart doktor-shlif      # перезапуск (например, после смены .env)
sudo systemctl reload nginx   # перечитать конфиг nginx
```

## SEO

Уже настроено: уникальные `title` и `description` на всех страницах, шаблон
`%s | ДокторШлиф`, canonical, Open Graph, по одному `h1` на страницу,
разметка schema.org (`HomeAndConstructionBusiness`, `FAQPage`, `BreadcrumbList`,
`Service`), автоматические `sitemap.xml` и `robots.txt`, фавиконка `app/icon.svg`.

## Чек-лист перед публикацией

- [ ] Указать реальный домен в `lib/site.ts` (`url`)
- [ ] Дозаполнить email и адрес офиса в `lib/site.ts`
- [ ] Прописать `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env` на сервере
- [ ] Заменить заглушки на фотографии объектов
- [ ] Добавить картинку для соцсетей `app/opengraph-image.jpg` (1200×630)
- [ ] Согласовать тексты политики и оферты (`app/politika`, `app/oferta`)
- [ ] Заменить отзывы в `lib/content.ts` на реальные
- [ ] Подключить Яндекс.Метрику и Яндекс.Вебмастер
