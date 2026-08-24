// Конфигурация PM2: держит Next.js запущенным и поднимает его после перезагрузки сервера.
// Запуск на сервере: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: "doktor-shlif",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
