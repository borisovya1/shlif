import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Иначе Turbopack поднимается до домашней папки из-за чужого package-lock.json
  turbopack: { root: projectRoot },
  // Каждый маршрут доступен со слешем на конце: /uslugi/pokraska/
  trailingSlash: true,
  // Иначе Next.js режет запросы с ngrok-домена в режиме dev
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
