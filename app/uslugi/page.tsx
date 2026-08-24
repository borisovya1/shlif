import type { Metadata } from "next";
import Link from "next/link";

import Contacts from "@/components/sections/Contacts";
import { ArrowRightIcon, ServiceIcon } from "@/components/ui/icons";
import { getChildren, menuGroups, serviceHref } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Услуги: отделка деревянных домов в ${site.regionShort}`,
  description:
    "Все направления работ: шлифовка, покраска, тёплый шов, обсада и окосячка, кровля, инженерия, отделка и собственное производство.",
  alternates: { canonical: "/uslugi/" },
  openGraph: {
    url: "/uslugi/",
    title: `Услуги: отделка деревянных домов в ${site.regionShort} | ${site.name}`,
    description:
      "Все направления работ: шлифовка, покраска, тёплый шов, обсада и окосячка, кровля, инженерия, отделка и собственное производство.",
  },
};

export default function ServicesIndexPage() {
  return (
    <>
      <section className="bg-bark-950 py-16 text-white lg:py-24">
        <div className="container-page">
          <nav aria-label="Хлебные крошки" className="text-sm text-bark-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-copper-300">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-bark-200">Услуги</li>
            </ol>
          </nav>

          <h1 className="mt-8 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Услуги для деревянного дома
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-bark-200">
            Полный цикл работ: от подготовки древесины и покраски до кровли, инженерии и
            изготовления изделий на собственном производстве.
          </p>
        </div>
      </section>

      <section className="bg-bark-50 py-16 lg:py-24">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {menuGroups.map((service) => {
            const children = getChildren(service);
            return (
              <div key={service.slug} className="card flex flex-col p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-copper-50 text-copper-600">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>

                <h2 className="mt-5 text-lg font-bold text-bark-900">
                  <Link href={serviceHref(service.slug)} className="hover:text-copper-600">
                    {service.menuTitle ?? service.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-bark-500">{service.excerpt}</p>

                {children.length ? (
                  <ul className="mt-4 space-y-1.5 border-l border-bark-100 pl-3 text-sm">
                    {children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={serviceHref(child.slug)}
                          className="text-bark-500 transition hover:text-copper-600"
                        >
                          {child.menuTitle ?? child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <Link
                  href={serviceHref(service.slug)}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-copper-600"
                >
                  Подробнее
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <Contacts />
    </>
  );
}
