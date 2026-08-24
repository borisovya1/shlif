"use client";

import { useState } from "react";

import CallbackButton from "@/components/ui/CallbackButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { PlusIcon } from "@/components/ui/icons";
import { faq } from "@/lib/content";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-bark-50 py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="Вопросы"
            title="Частые вопросы"
            text="Собрали то, о чём чаще всего спрашивают перед началом работ. Не нашли ответ — задайте вопрос напрямую."
          />
          <CallbackButton className="btn btn-primary mt-8">Бесплатный замер</CallbackButton>
        </div>

        <div className="divide-y divide-bark-200 border-y border-bark-200">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-bark-900 sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${
                      isOpen
                        ? "rotate-45 border-copper-500 bg-copper-500 text-white"
                        : "border-bark-300 text-bark-600"
                    }`}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pr-12 text-sm leading-relaxed text-bark-500 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
