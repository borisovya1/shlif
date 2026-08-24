"use client";

import { useEffect, useMemo, useState } from "react";

import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, PlusIcon } from "@/components/ui/icons";
import { projectCategories, projects, type Project } from "@/lib/content";

const INITIAL_COUNT = 9;

export default function Portfolio() {
  const [category, setCategory] = useState<string>("Все");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [slide, setSlide] = useState(0);

  const filtered = useMemo(
    () =>
      category === "Все"
        ? projects
        : projects.filter((project) => project.category === category),
    [category],
  );

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setSlide((current) => (current + 1) % active.photos);
      if (event.key === "ArrowLeft")
        setSlide((current) => (current - 1 + active.photos) % active.photos);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  function openProject(project: Project) {
    setActive(project);
    setSlide(0);
  }

  return (
    <section id="portfolio" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Портфолио"
          title="Наши проекты"
          text="Оцените качество работы: мы бережно восстанавливаем древесину, возвращая домам первозданный вид и надёжную защиту."
        />

        <div className="mt-9 flex flex-wrap gap-2.5">
          {["Все", ...projectCategories].map((item) => {
            const isActive = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setExpanded(false);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-bark-900 bg-bark-900 text-white"
                    : "border-bark-200 text-bark-600 hover:border-bark-400 hover:text-bark-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => openProject(project)}
              className="group overflow-hidden rounded-[1.25rem] border border-bark-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-lg hover:shadow-bark-900/5"
            >
              <div className="relative">
                <Photo
                  alt={project.title}
                  tone={project.tone}
                  className="aspect-4/3 w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-bark-800">
                  {project.category}
                </span>
                <span className="absolute top-3 right-3 rounded-full bg-bark-900/75 px-3 py-1 text-xs font-semibold text-white">
                  {project.photos} фото
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-bark-900 group-hover:text-copper-600">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-bark-400">{project.tags.join(" · ")}</p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length > INITIAL_COUNT ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="btn btn-outline"
            >
              {expanded ? (
                "Свернуть"
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  Показать ещё {filtered.length - INITIAL_COUNT}
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>

      {active ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div
            className="absolute inset-0 bg-bark-950/85 backdrop-blur-sm"
            onClick={() => setActive(null)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="animate-fade-up relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Закрыть"
              className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-bark-800 transition hover:bg-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <Photo
                alt={`${active.title} — фото ${slide + 1}`}
                tone={active.tone + slide}
                sizes="(max-width: 768px) 100vw, 56rem"
                className="aspect-16/10 w-full"
              />

              {active.photos > 1 ? (
                <>
                  <button
                    type="button"
                    aria-label="Предыдущее фото"
                    onClick={() =>
                      setSlide((current) => (current - 1 + active.photos) % active.photos)
                    }
                    className="absolute top-1/2 left-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-bark-900 transition hover:bg-white"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Следующее фото"
                    onClick={() => setSlide((current) => (current + 1) % active.photos)}
                    className="absolute top-1/2 right-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-bark-900 transition hover:bg-white"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-bark-950/70 px-3 py-1 text-xs font-semibold text-white">
                    {slide + 1} / {active.photos}
                  </span>
                </>
              ) : null}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-bark-100 px-3 py-1 text-xs font-bold text-bark-700">
                  {active.category}
                </span>
                {active.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-copper-50 px-3 py-1 text-xs font-bold text-copper-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="mt-4 text-2xl font-extrabold text-bark-900">{active.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-500">
                Фото реального объекта из рабочего архива. Направления работ:{" "}
                {active.tags.join(", ").toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
