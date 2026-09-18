import Link from "next/link";

import { site } from "@/lib/site";

export default function Logo({
  tone = "dark",
  compact = false,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  const isLight = tone === "light";

  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={site.name}>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 ${
          isLight ? "bg-white/10 text-copper-300" : "bg-bark-900 text-copper-300"
        }`}
      >
        {/* Ш под двускатной крышей: дом и первая буква названия */}
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 10.5 12 4.5l7.5 6" />
          <path d="M7 13v6.5h10V13M12 13v6.5" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={`truncate text-sm font-extrabold tracking-tight sm:text-base ${
            isLight ? "text-white" : "text-bark-900"
          }`}
        >
          {site.name}
        </span>
        <span
          className={`truncate text-[11px] font-medium tracking-wide ${
            compact ? "hidden sm:block" : ""
          } ${isLight ? "text-bark-300" : "text-bark-400"}`}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
