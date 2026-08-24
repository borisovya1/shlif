import SectionHeading from "@/components/ui/SectionHeading";
import { steps } from "@/lib/content";

export default function Steps() {
  return (
    <section id="steps" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Этапы работы"
          title="Как мы работаем"
          text="От первого выезда до поддержки после сдачи — пять понятных шагов, зафиксированных в договоре."
        />

        <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              <div className="flex items-center gap-4 lg:block">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-bark-900 text-lg font-extrabold text-copper-300">
                  {step.number}
                </span>
                {index < steps.length - 1 ? (
                  <span className="hidden h-px flex-1 bg-bark-200 lg:absolute lg:top-7 lg:left-16 lg:block lg:w-[calc(100%-3.5rem)]" />
                ) : null}
              </div>

              <h3 className="mt-5 text-lg font-bold text-bark-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-500">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
