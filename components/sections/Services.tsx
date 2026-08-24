import Link from "next/link";

import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon, ServiceIcon } from "@/components/ui/icons";
import { featuredServices, serviceHref } from "@/lib/services";

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-bark-50 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Наши услуги"
          title="Полный цикл работ с деревянным домом"
          text="От подготовки древесины до кровли и инженерии — все направления закрывает одна команда."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <Link
              key={service.slug}
              href={serviceHref(service.slug)}
              className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-copper-300 hover:shadow-lg hover:shadow-bark-900/5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-copper-50 text-copper-600 transition group-hover:bg-copper-500 group-hover:text-white">
                <ServiceIcon name={service.icon} className="h-6 w-6" />
              </span>

              <h3 className="mt-5 text-lg font-bold text-bark-900">
                {service.menuTitle ?? service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-500">
                {service.excerpt}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-copper-600">
                Подробнее
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
