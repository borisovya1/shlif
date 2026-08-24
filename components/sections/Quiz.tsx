"use client";

import { useState } from "react";

import LeadForm from "@/components/ui/LeadForm";
import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

const workOptions = [
  "Шлифовка",
  "Покраска",
  "Тёплый шов",
  "Обсада окон",
  "Обсада дверей",
  "Крыши",
  "Инженерия",
  "Отделочные работы",
];

const houseOptions = [
  "Сруб (бревенчатый)",
  "Дом из бруса",
  "Клеёный брус",
  "Оцилиндровка",
  "Лафет",
  "Баня / сауна",
];

const TOTAL_QUESTIONS = 3;

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [works, setWorks] = useState<string[]>([]);
  const [houseType, setHouseType] = useState("");
  const [area, setArea] = useState(120);

  const canContinue = step === 0 ? works.length > 0 : step === 1 ? Boolean(houseType) : true;
  const progress = Math.round((Math.min(step, TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100);

  function toggleWork(option: string) {
    setWorks((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  return (
    <section id="quiz" className="scroll-mt-24 bg-bark-900 py-20 text-white lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Расчёт стоимости"
            tone="light"
            title="Получите консультацию"
            text="Три вопроса — и мы перезвоним, чтобы уточнить детали и назвать ориентир по стоимости."
          />

          <Photo
            alt="Деревянный дом после отделки"
            tone={5}
            sizes="(max-width: 1024px) 100vw, 32rem"
            className="mt-10 hidden aspect-16/10 w-full rounded-3xl border border-white/10 lg:block"
          />
        </div>

        <div className="rounded-[2rem] bg-white p-6 text-bark-900 shadow-2xl shadow-black/20 sm:p-9">
          {step < TOTAL_QUESTIONS ? (
            <>
              <div className="flex items-center justify-between text-xs font-bold tracking-wide text-bark-400 uppercase">
                <span>
                  Вопрос {step + 1} из {TOTAL_QUESTIONS}
                </span>
                <span className="text-copper-600">{progress}%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bark-100">
                <div
                  className="h-full rounded-full bg-copper-500 transition-all duration-300"
                  style={{ width: `${Math.max(progress, 8)}%` }}
                />
              </div>
            </>
          ) : null}

          {step === 0 ? (
            <div className="mt-7">
              <h3 className="text-xl font-extrabold">Что нужно сделать?</h3>
              <p className="mt-1 text-sm text-bark-400">Можно выбрать несколько вариантов</p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {workOptions.map((option) => {
                  const active = works.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleWork(option)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "border-copper-500 bg-copper-500 text-white"
                          : "border-bark-200 text-bark-700 hover:border-copper-300 hover:text-copper-600"
                      }`}
                    >
                      {active ? <CheckIcon className="h-4 w-4" strokeWidth={2.5} /> : null}
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-7">
              <h3 className="text-xl font-extrabold">Какой тип дома у вас?</h3>
              <p className="mt-1 text-sm text-bark-400">Выберите один вариант</p>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {houseOptions.map((option) => {
                  const active = houseType === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setHouseType(option)}
                      aria-pressed={active}
                      className={`rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition ${
                        active
                          ? "border-copper-500 bg-copper-50 text-copper-700"
                          : "border-bark-200 text-bark-700 hover:border-copper-300"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-7">
              <h3 className="text-xl font-extrabold">Площадь дома</h3>
              <p className="mt-1 text-sm text-bark-400">Примерное значение, уточним на замере</p>

              <div className="mt-6 rounded-2xl border border-bark-200 p-5">
                <div className="flex items-end justify-center gap-2">
                  <span className="text-5xl font-extrabold text-bark-900">{area}</span>
                  <span className="pb-2 text-lg font-semibold text-bark-400">м²</span>
                </div>

                <input
                  type="range"
                  min={20}
                  max={600}
                  step={10}
                  value={area}
                  onChange={(event) => setArea(Number(event.target.value))}
                  aria-label="Площадь дома"
                  className="mt-6 w-full"
                />
                <div className="mt-2 flex justify-between text-xs font-semibold text-bark-400">
                  <span>20 м²</span>
                  <span>600 м²</span>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h3 className="text-xl font-extrabold">Ваш телефон</h3>
              <p className="mt-1 text-sm text-bark-400">
                Перезвоним в течение 30 минут и уточним детали
              </p>

              <dl className="mt-5 space-y-2 rounded-2xl bg-bark-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-bark-400">Работы</dt>
                  <dd className="text-right font-semibold">{works.join(", ")}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-bark-400">Тип дома</dt>
                  <dd className="text-right font-semibold">{houseType}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-bark-400">Площадь</dt>
                  <dd className="text-right font-semibold">{area} м²</dd>
                </div>
              </dl>

              <LeadForm
                source="quiz"
                buttonLabel="Получить консультацию"
                className="mt-5"
                details={{
                  Работы: works.join(", "),
                  "Тип дома": houseType,
                  Площадь: `${area} м²`,
                }}
              />
            </div>
          ) : null}

          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="inline-flex items-center gap-2 text-sm font-bold text-bark-500 transition hover:text-bark-900"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Назад
              </button>
            ) : (
              <span />
            )}

            {step < TOTAL_QUESTIONS ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((current) => current + 1)}
                className="btn btn-dark px-7 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Далее
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
