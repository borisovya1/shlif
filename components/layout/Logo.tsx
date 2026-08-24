import Link from "next/link";

import { site } from "@/lib/site";

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";

  return (
    <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
          isLight ? "bg-white/10 text-copper-300" : "bg-bark-900 text-copper-300"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`text-base font-extrabold tracking-tight ${
            isLight ? "text-white" : "text-bark-900"
          }`}
        >
          {site.name}
        </span>
        <span
          className={`text-[11px] font-medium tracking-wide ${
            isLight ? "text-bark-300" : "text-bark-400"
          }`}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
