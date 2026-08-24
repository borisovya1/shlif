import type { MetadataRoute } from "next";

import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, priority: 1 },
    { url: `${base}/uslugi/`, lastModified, priority: 0.9 },
    ...services.map((service) => ({
      url: `${base}/uslugi/${service.slug}/`,
      lastModified,
      priority: 0.8,
    })),
    { url: `${base}/politika/`, lastModified, priority: 0.2 },
    { url: `${base}/oferta/`, lastModified, priority: 0.2 },
  ];
}
