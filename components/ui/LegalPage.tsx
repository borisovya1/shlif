export type LegalSection = {
  id?: string;
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  updated?: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <section className="bg-bark-50 pt-[8.75rem] pb-16 sm:pt-[10rem] lg:pt-[12.25rem] lg:pb-24">
      <div className="container-page max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-bark-900 sm:text-4xl">
          {title}
        </h1>
        {updated ? <p className="mt-4 text-sm text-bark-400">Редакция от {updated}</p> : null}

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.title} id={section.id} className="scroll-mt-28">
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
