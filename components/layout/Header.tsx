"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Logo from "@/components/layout/Logo";
import { useModals } from "@/components/modals/modal-context";
import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  PhoneIcon,
  ServiceIcon,
} from "@/components/ui/icons";
import { getChildren, menuGroups, serviceHref } from "@/lib/services";
import { navLinks, site } from "@/lib/site";

const desktopLinks = navLinks.filter((link) =>
  ["/#portfolio", "/#steps", "/#about", "/#faq", "/#contacts"].includes(link.href),
);

export default function Header() {
  const { openCallback } = useModals();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const mobileMenu = mobileOpen ? (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <div
        className="absolute inset-0 bg-bark-950/60"
        onClick={closeMobile}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 right-0 flex h-dvh w-[min(100%,24rem)] flex-col bg-bark-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-bark-200 px-4">
          <Logo compact />
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Закрыть меню"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-bark-200 text-bark-900"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <button
            type="button"
            onClick={() => setMobileServicesOpen((open) => !open)}
            aria-expanded={mobileServicesOpen}
            className="flex w-full items-center justify-between py-3 text-lg font-bold text-bark-900"
          >
            Услуги
            <ChevronDownIcon
              className={`h-5 w-5 shrink-0 transition-transform ${
                mobileServicesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileServicesOpen ? (
            <ul
              onClick={closeMobile}
              className="mb-2 space-y-1 border-l border-bark-200 pl-4"
            >
              {menuGroups.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={serviceHref(service.slug)}
                    className="block py-2 text-[15px] font-semibold text-bark-700"
                  >
                    {service.menuTitle ?? service.title}
                  </Link>
                  {getChildren(service).length ? (
                    <ul className="mb-1 space-y-1 border-l border-bark-100 pl-3">
                      {getChildren(service).map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={serviceHref(child.slug)}
                            className="block py-1.5 text-sm text-bark-500"
                          >
                            {child.menuTitle ?? child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          <nav
            onClick={closeMobile}
            className="divide-y divide-bark-200 border-t border-bark-200"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3.5 text-lg font-bold text-bark-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-bark-200 px-4 py-4">
          <a href={site.phone.href} className="block text-xl font-extrabold text-bark-900">
            {site.phone.display}
          </a>
          <p className="mt-1 text-sm text-bark-400">{site.workingHours}</p>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              openCallback();
            }}
            className="btn btn-primary mt-4 w-full"
          >
            Заказать звонок
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-bark-200 bg-bark-50/95 backdrop-blur-md"
          : "border-b border-transparent bg-bark-50"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-6">
        <Logo compact />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          <div
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setMegaOpen(true);
            }}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              onClick={() => setMegaOpen((open) => !open)}
              aria-expanded={megaOpen}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-bark-700 transition hover:bg-bark-100 hover:text-bark-900"
            >
              Услуги
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
              />
            </button>

            {megaOpen ? (
              <div
                className="absolute top-full left-1/2 w-[min(72rem,calc(100vw-3rem))] -translate-x-1/2 pt-3"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <div
                  onClick={() => setMegaOpen(false)}
                  className="animate-fade-up grid gap-x-8 gap-y-6 rounded-3xl border border-bark-200 bg-white p-7 shadow-xl shadow-bark-900/5 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {menuGroups.map((service) => {
                    const children = getChildren(service);
                    return (
                      <div key={service.slug}>
                        <Link
                          href={serviceHref(service.slug)}
                          className="group flex items-start gap-3"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-copper-50 text-copper-600 transition group-hover:bg-copper-500 group-hover:text-white">
                            <ServiceIcon name={service.icon} className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-bark-900 group-hover:text-copper-600">
                              {service.menuTitle ?? service.title}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-bark-400">
                              {service.excerpt}
                            </span>
                          </span>
                        </Link>

                        {children.length ? (
                          <ul className="mt-3 space-y-1.5 border-l border-bark-100 pl-3">
                            {children.map((child) => (
                              <li key={child.slug}>
                                <Link
                                  href={serviceHref(child.slug)}
                                  className="block text-sm text-bark-500 transition hover:text-copper-600"
                                >
                                  {child.menuTitle ?? child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-bark-700 transition hover:bg-bark-100 hover:text-bark-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={site.phone.href}
            className="hidden text-sm font-bold text-bark-900 transition hover:text-copper-600 md:block"
          >
            {site.phone.display}
          </a>
          <button
            type="button"
            onClick={openCallback}
            className="btn btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex"
          >
            Заказать звонок
          </button>
          <a
            href={site.phone.href}
            aria-label="Позвонить"
            className="btn btn-primary p-3 sm:hidden"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
            className="grid h-11 w-11 place-items-center rounded-xl border border-bark-200 text-bark-900 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mounted ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}
