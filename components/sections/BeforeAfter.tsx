"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { beforeAfter, type BeforeAfterItem } from "@/lib/content";

function Compare({ item }: { item: BeforeAfterItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const reduceMotion = useReducedMotion();

  function updateFromClientX(clientX: number) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const ratio = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setTouched(true);
    updateFromClientX(event.clientX);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  }

  function stopDragging() {
    setDragging(false);
  }

  return (
    <motion.figure
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onDragStart={(event) => event.preventDefault()}
        className="relative aspect-4/3 w-full cursor-ew-resize touch-none overflow-hidden rounded-3xl border border-bark-200 select-none"
      >
        <div className="absolute inset-0">
          <Photo
            src={item.afterSrc}
            alt={`${item.title} — после`}
            tone={item.tone}
            sizes="(max-width: 1024px) 100vw, 36rem"
            className="h-full w-full"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Photo
            src={item.beforeSrc}
            alt={`${item.title} — до`}
            tone={item.tone + 6}
            sizes="(max-width: 1024px) 100vw, 36rem"
            className="h-full w-full"
          />
        </div>

        <span className="absolute top-4 left-4 rounded-full bg-bark-950/70 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
          До
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-bark-950/70 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
          После
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white/90"
          style={{ left: `${position}%` }}
        >
          <motion.span
            className="pointer-events-none absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-bark-900 shadow-lg"
            animate={
              !touched && !reduceMotion
                ? { x: [0, -7, 7, -4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6-5 6 5 6M15 6l5 6-5 6" />
            </svg>
          </motion.span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(position)}
        onChange={(event) => {
          setTouched(true);
          setPosition(Number(event.target.value));
        }}
        aria-label={`Сравнение «до и после»: ${item.title}`}
        className="mt-4 w-full"
      />

      <figcaption className="mt-3">
        <h3 className="font-serif text-lg font-bold text-bark-900">{item.title}</h3>
        <p className="mt-1 text-sm text-bark-500">{item.caption}</p>
      </figcaption>
    </motion.figure>
  );
}

export default function BeforeAfter() {
  return (
    <section id="before-after" className="scroll-mt-24 bg-bark-50 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Результат"
          title="До и после"
          text="Потяните ползунок, чтобы сравнить состояние объекта до начала работ и после сдачи."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {beforeAfter.map((item) => (
            <Compare key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
