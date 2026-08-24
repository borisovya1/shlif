import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Публичная оферта",
  description: "Условия оказания услуг по отделке и обработке деревянных домов.",
  alternates: { canonical: "/oferta/" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "1. Предмет оферты",
    paragraphs: [
      `${site.name} (далее — Исполнитель) предлагает физическим и юридическим лицам (далее — Заказчик) услуги по строительству, отделке и обработке деревянных домов.`,
      "Настоящий документ является публичной офертой. Точный объём, сроки и стоимость работ фиксируются в договоре и смете, подписываемых сторонами.",
    ],
  },
  {
    title: "2. Порядок оказания услуг",
    paragraphs: [
      "Работы начинаются после осмотра объекта, согласования сметы и подписания договора.",
      "Исполнитель вправе привлекать субподрядчиков, оставаясь ответственным за результат перед Заказчиком.",
    ],
  },
  {
    title: "3. Стоимость и оплата",
    paragraphs: [
      "Стоимость определяется сметой и не изменяется в одностороннем порядке. Дополнительные работы оформляются отдельным приложением.",
      "Порядок и сроки оплаты определяются договором.",
    ],
  },
  {
    title: "4. Гарантия",
    paragraphs: [
      `Гарантийный срок на выполненные работы составляет до ${site.stats.warranty} и зависит от вида работ и применяемых материалов.`,
      "Гарантия не распространяется на дефекты, возникшие из-за нарушения условий эксплуатации или вмешательства третьих лиц.",
    ],
  },
  {
    title: "5. Контакты",
    paragraphs: [
      `Телефон: ${site.phone.display}. Электронная почта: ${site.email.display}. Адрес: ${site.address.display}.`,
    ],
  },
];

export default function OfferPage() {
  return (
    <section className="bg-bark-50 py-16 lg:py-24">
      <div className="container-page max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-bark-900 sm:text-4xl">
          Публичная оферта
        </h1>
        <p className="mt-4 text-sm text-bark-400">
          Шаблонный текст: перед публикацией согласуйте формулировки с юристом и укажите
          реквизиты организации.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-bark-900">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-bark-600">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
