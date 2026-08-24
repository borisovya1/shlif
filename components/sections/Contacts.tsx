import LeadForm from "@/components/ui/LeadForm";
import SectionHeading from "@/components/ui/SectionHeading";
import { CheckIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

const perks = ["Бесплатная консультация", "Без спама и рассылок", "Смета по телефону"];

export default function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Связаться"
            title="Оставьте заявку"
            text="Расскажите о вашем доме — перезвоним в течение 30 минут, ответим на вопросы и рассчитаем стоимость."
          />

          <ul className="mt-10 space-y-5">
            <li className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-50 text-copper-600">
                <PhoneIcon className="h-6 w-6" />
              </span>
              <span>
                <a
                  href={site.phone.href}
                  className="block text-xl font-extrabold text-bark-900 transition hover:text-copper-600"
                >
                  {site.phone.display}
                </a>
                <span className="text-sm text-bark-400">{site.phone.note}</span>
              </span>
            </li>

            <li className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-50 text-copper-600">
                <MailIcon className="h-6 w-6" />
              </span>
              <span>
                <a
                  href={site.email.href}
                  className="block text-lg font-bold text-bark-900 transition hover:text-copper-600"
                >
                  {site.email.display}
                </a>
                <span className="text-sm text-bark-400">{site.email.note}</span>
              </span>
            </li>

            <li className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-50 text-copper-600">
                <PinIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-lg font-bold text-bark-900">
                  {site.address.note}
                </span>
                <span className="text-sm text-bark-400">{site.address.display}</span>
              </span>
            </li>

            <li className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-50 text-copper-600">
                <ClockIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-lg font-bold text-bark-900">Режим работы</span>
                <span className="text-sm text-bark-400">{site.workingHours}</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-bark-900 p-7 text-white sm:p-9">
          <h3 className="text-2xl font-extrabold">Оставьте телефон</h3>
          <p className="mt-2 text-sm text-bark-300">
            Перезвоним в течение 30 минут и уточним детали проекта.
          </p>

          <LeadForm
            source="contacts"
            tone="dark"
            withName
            buttonLabel="Отправить заявку"
            className="mt-6"
          />

          <ul className="mt-7 grid gap-2.5 border-t border-white/10 pt-6 text-sm text-bark-300">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-copper-300" strokeWidth={2.5} />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
