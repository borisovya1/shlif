import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { site } from "@/lib/site";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.tagline} в ${site.regionShort} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
    title: `${site.tagline} в ${site.regionShort} | ${site.name}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1713",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  description: site.description,
  telephone: site.phone.display,
  email: site.email.display,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.display,
    addressCountry: "RU",
  },
  areaServed: { "@type": "AdministrativeArea", name: site.region },
  openingHours: "Mo-Su 09:00-21:00",
  priceRange: "$$",
  url: site.url,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ModalProvider>
          <Header />
          <main id="top">{children}</main>
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
