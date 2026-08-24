import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
