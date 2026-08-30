import Link from "next/link";

import CallbackButton from "@/components/ui/CallbackButton";
import Photo from "@/components/ui/Photo";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/icons";
import { heroBenefits } from "@/lib/content";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bark-950 text-white">
      <div className="absolute inset-0">
        <Photo
          alt="Отделка деревянного дома"
          tone={1}
          priority
          sizes="100vw"
          className="h-full w-full"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(16,13,11,0.94) 0%, rgba(16,13,11,0.82) 45%, rgba(16,13,11,0.35) 100%)",
        }}
      />

      <div className="relative">
        <div className="container-page grid gap-10 py-14 sm:gap-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-28">
          <div>
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-copper-200 uppercase backdrop-blur-sm sm:px-4 sm:text-xs">
              <ShieldIcon className="h-4 w-4 shrink-0" />
              <span className="min-w-0">
                Работаем по договору · Гарантия {site.stats.warranty}
              </span>
            </span>

            <h1 className="mt-6 text-[1.75rem] leading-[1.15] font-extrabold tracking-tight sm:text-4xl sm:leading-[1.05] lg:text-6xl">
              Отделка деревянного дома
              <span className="mt-2 block text-xl font-bold text-copper-300 sm:mt-3 sm:text-3xl lg:text-4xl">
                в {site.regionIn}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark-200">
              Шлифовка, покраска, тёплый шов, обсада и комплексные работы под ключ. Гарантия
              на работы, фиксированная смета, бесплатный выезд замерщика.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CallbackButton className="btn btn-primary">
                Получить консультацию
                <ArrowRightIcon className="h-5 w-5" />
              </CallbackButton>
              <Link href="/#services" className="btn btn-ghost-light">
                Наши услуги
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-9 sm:grid-cols-4">
              {heroBenefits.map((benefit) => (
                <div key={benefit.title}>
                  <dt className="text-xl font-extrabold text-white">{benefit.title}</dt>
                  <dd className="mt-1 text-sm text-bark-400">{benefit.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hidden lg:block">
            <div className="relative ml-auto w-full max-w-md">
              <Photo
                alt="Фасад деревянного дома после отделки"
                tone={7}
                sizes="(max-width: 1024px) 0px, 28rem"
                className="aspect-4/5 w-full rounded-[2rem] border border-white/15"
              />
              <div className="absolute -bottom-6 -left-10 w-56 rounded-2xl border border-white/15 bg-bark-900/90 p-5 backdrop-blur">
                <p className="text-3xl font-extrabold text-copper-300">
                  {site.stats.objects}
                </p>
                <p className="mt-1 text-sm text-bark-300">
                  домов отреставрировано за {site.stats.years} лет работы
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
