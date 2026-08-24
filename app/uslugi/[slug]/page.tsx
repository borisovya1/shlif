import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Contacts from "@/components/sections/Contacts";
import JsonLd from "@/components/seo/JsonLd";
import CallbackButton from "@/components/ui/CallbackButton";
import Photo from "@/components/ui/Photo";
import { ArrowRightIcon, CheckIcon, ServiceIcon } from "@/components/ui/icons";
import {
  getChildren,
  getParent,
  getService,
  serviceHref,
  services,
} from "@/lib/services";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  const title = `${service.title} в ${site.regionShort}`;
  const description = `${service.excerpt} Работаем по договору с фиксированной сметой, бесплатный выезд замерщика, гарантия до ${site.stats.warranty}.`;

  return {
    title,
    description,
    alternates: { canonical: serviceHref(service.slug) },
    openGraph: {
      url: serviceHref(service.slug),
      title: `${title} | ${site.name}`,
      description,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const children = getChildren(service);
  const parent = getParent(service);
  const siblings = services.filter(
    (item) => item.featured && item.slug !== service.slug && item.slug !== parent?.slug,
  );

  const base = site.url.replace(/\/$/, "");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Услуги", item: `${base}/uslugi/` },
      ...(parent
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: parent.menuTitle ?? parent.title,
              item: `${base}${serviceHref(parent.slug)}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: parent ? 4 : 3,
        name: service.menuTitle ?? service.title,
        item: `${base}${serviceHref(service.slug)}`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.excerpt,
    serviceType: service.menuTitle ?? service.title,
    areaServed: { "@type": "AdministrativeArea", name: site.region },
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: site.name,
      telephone: site.phone.display,
      url: base,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <section className="relative overflow-hidden bg-bark-950 text-white">
        <div className="absolute inset-0">
          <Photo
            alt={service.title}
            tone={service.title.length % 12}
            sizes="100vw"
            priority
            className="h-full w-full"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(16,13,11,0.95) 0%, rgba(16,13,11,0.85) 50%, rgba(16,13,11,0.5) 100%)",
          }}
        />

        <div className="relative container-page py-16 lg:py-24">
          <nav aria-label="Хлебные крошки" className="text-sm text-bark-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-copper-300">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              {parent ? (
                <>
                  <li>
                    <Link
                      href={serviceHref(parent.slug)}
                      className="transition hover:text-copper-300"
                    >
                      {parent.menuTitle ?? parent.title}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                </>
              ) : null}
              <li className="text-bark-200">{service.menuTitle ?? service.title}</li>
            </ol>
          </nav>

          <div className="mt-8 flex items-start gap-5">
            <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/5 text-copper-300 sm:grid">
              <ServiceIcon name={service.icon} className="h-8 w-8" />
            </span>
            <div>
              <h1 className="max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-bark-200">{service.excerpt}</p>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CallbackButton className="btn btn-primary">
              Рассчитать стоимость
              <ArrowRightIcon className="h-5 w-5" />
            </CallbackButton>
            <a href={site.phone.href} className="btn btn-ghost-light">
              {site.phone.display}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-bark-50 py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <p className="text-lg leading-relaxed text-bark-700">{service.intro}</p>

            <h2 className="mt-12 text-2xl font-extrabold text-bark-900">Что входит в работу</h2>
            <ul className="mt-6 space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-copper-100 text-copper-700">
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-bark-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            {service.highlights.map((highlight) => (
              <div key={highlight.title} className="card p-6">
                <h3 className="font-bold text-bark-900">{highlight.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark-500">{highlight.text}</p>
              </div>
            ))}

            <div className="rounded-card bg-bark-900 p-6 text-white">
              <p className="text-lg font-bold">Бесплатный выезд замерщика</p>
              <p className="mt-2 text-sm text-bark-300">
                Приедем на объект, оценим состояние древесины и посчитаем смету — без
                обязательств.
              </p>
              <CallbackButton className="btn btn-primary mt-5 w-full">
                Вызвать замерщика
              </CallbackButton>
            </div>
          </div>
        </div>
      </section>

      {children.length ? (
        <section className="bg-white py-16 lg:py-24">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold text-bark-900 sm:text-3xl">
              Направления внутри услуги
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Link
                  key={child.slug}
                  href={serviceHref(child.slug)}
                  className="card group p-6 transition hover:-translate-y-1 hover:border-copper-300"
                >
                  <h3 className="text-lg font-bold text-bark-900 group-hover:text-copper-600">
                    {child.title}
                  </h3>
                  <p className="mt-2 text-sm text-bark-500">{child.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-copper-600">
                    Подробнее
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 lg:pb-24">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold text-bark-900 sm:text-3xl">Другие услуги</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {siblings.map((item) => (
              <Link
                key={item.slug}
                href={serviceHref(item.slug)}
                className="inline-flex items-center gap-2 rounded-full border border-bark-200 px-4 py-2.5 text-sm font-semibold text-bark-700 transition hover:border-copper-400 hover:text-copper-600"
              >
                <ServiceIcon name={item.icon} className="h-4 w-4" />
                {item.menuTitle ?? item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Contacts />
    </>
  );
}
