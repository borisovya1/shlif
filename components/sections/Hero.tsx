"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import CallbackButton from "@/components/ui/CallbackButton";
import Photo from "@/components/ui/Photo";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/icons";
import { heroBenefits } from "@/lib/content";
import { site } from "@/lib/site";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.5 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bark-950 text-white">
      <div className="absolute inset-0">
        <Photo
          src="/assets/1.webp"
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

      <div
        className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full opacity-60 blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(226,165,104,0.4), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {!reduceMotion ? (
        <>
          {/* Необработанная поверхность дерева, которую "снимает" шлифовка при загрузке */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 7px), linear-gradient(100deg, #201b16 0%, #453a30 40%, #7e6c58 72%, #a08e78 100%)",
            }}
            initial={{ clipPath: "inset(0 0 0 0%)" }}
            animate={{ clipPath: "inset(0 0 0 101%)" }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          />
          {/* Тёплый отблеск на границе шлифовки — след света на свежеснятой поверхности */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 w-24 -translate-x-1/2 mix-blend-screen blur-2xl"
            style={{
              background: "radial-gradient(circle, rgba(239,199,156,0.65), transparent 70%)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: "101%" }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          />
        </>
      ) : null}

      <div className="relative">
        <motion.div
          className="container-page grid gap-10 pt-[8.25rem] pb-14 sm:gap-14 sm:pt-[11rem] sm:pb-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pt-[13.25rem] lg:pb-28"
          variants={container}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
        >
          <div>
            <motion.span
              variants={item}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-copper-200 uppercase backdrop-blur-sm sm:px-4 sm:text-xs"
            >
              <ShieldIcon className="h-4 w-4 shrink-0" />
              <span className="min-w-0">
                Работаем по договору · Гарантия {site.stats.warranty}
              </span>
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 font-serif text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-4xl sm:leading-[1.05] lg:text-6xl"
            >
              Отделка деревянного дома
              <span className="mt-2 block text-xl font-semibold text-copper-300 sm:mt-3 sm:text-3xl lg:text-4xl">
                в {site.regionIn}
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-bark-200">
              Шлифовка, покраска, тёплый шов, обсада и комплексные работы под ключ. Гарантия
              на работы, фиксированная смета, бесплатный выезд замерщика.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CallbackButton className="btn btn-primary">
                Получить консультацию
                <ArrowRightIcon className="h-5 w-5" />
              </CallbackButton>
              <Link href="/#services" className="btn btn-ghost-light">
                Наши услуги
              </Link>
            </motion.div>

            <motion.dl
              variants={item}
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8"
            >
              {heroBenefits.map((benefit) => (
                <div key={benefit.title}>
                  <dt className="font-serif text-xl font-bold text-white">{benefit.title}</dt>
                  <dd className="mt-1 text-sm text-bark-400">{benefit.text}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div variants={item} className="hidden lg:block">
            <div className="relative ml-auto w-full max-w-md">
              <Photo
                src="/assets/2.webp"
                alt="Фасад деревянного дома после отделки"
                tone={7}
                sizes="(max-width: 1024px) 0px, 28rem"
                className="aspect-4/3 w-full rounded-[2rem] border border-white/15"
              />
              <div className="absolute -bottom-6 -left-10 w-56 rounded-2xl border border-white/15 bg-bark-900/90 p-5 backdrop-blur">
                <p className="font-serif text-3xl font-bold text-copper-300">
                  {site.stats.warranty}
                </p>
                <p className="mt-1 text-sm text-bark-300">гарантии на выполненные работы</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
