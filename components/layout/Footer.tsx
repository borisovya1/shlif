import Link from "next/link";

import Logo from "@/components/layout/Logo";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { menuGroups, serviceHref } from "@/lib/services";
import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-bark-950 text-bark-300">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-bark-400">
            {site.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">Страницы</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-copper-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">Услуги</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {menuGroups.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(service.slug)}
                  className="transition hover:text-copper-300"
                >
                  {service.menuTitle ?? service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">Контакты</h3>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-copper-400" />
              <span>
                <a
                  href={site.phone.href}
                  className="block text-base font-bold text-white transition hover:text-copper-300"
                >
                  {site.phone.display}
                </a>
                <span className="text-xs text-bark-500">{site.phone.note}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-copper-400" />
              <span>
                <a
                  href={site.email.href}
                  className="block font-semibold text-white transition hover:text-copper-300"
                >
                  {site.email.display}
                </a>
                <span className="text-xs text-bark-500">{site.email.note}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-copper-400" />
              <span>
                <span className="block font-semibold text-white">{site.address.note}</span>
                <span className="text-xs text-bark-500">{site.address.display}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-bark-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Все права защищены.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/politika" className="transition hover:text-copper-300">
              Политика конфиденциальности
            </Link>
            <Link href="/oferta" className="transition hover:text-copper-300">
              Публичная оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
