import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { CheckIcon } from "@/components/ui/icons";
import { advantages, companyStats } from "@/lib/content";
import { site } from "@/lib/site";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-bark-50 py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Опыт и надёжность"
              title={`Более ${site.stats.years.replace("+", "")} лет работаем с деревом`}
              text="Строительно-отделочная компания полного цикла для деревянных домов: от коробки до профессиональной отделки и инженерии."
            />

            <p className="mt-5 max-w-2xl leading-relaxed text-bark-500">
              Мы объединяем комплекс строительных и отделочных работ у одного исполнителя:
              не нужно искать разных подрядчиков и согласовывать сроки между бригадами.
              Работаем по договору с фиксированной сметой, используем сертифицированные
              материалы и собственное производство.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {companyStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-extrabold text-copper-600 sm:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm text-bark-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Photo
            alt="Работы на объекте"
            tone={3}
            sizes="(max-width: 1024px) 100vw, 34rem"
            className="aspect-4/5 w-full rounded-[2rem] border border-bark-200"
          />
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-extrabold text-bark-900">Почему выбирают нас</h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-copper-50 text-copper-600">
                  <CheckIcon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h4 className="mt-4 font-bold text-bark-900">{advantage.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-bark-500">{advantage.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
