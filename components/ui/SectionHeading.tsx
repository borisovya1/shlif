import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <span className={`eyebrow ${tone === "light" ? "text-copper-300" : ""}`}>
          <span
            className={`h-px w-6 ${tone === "light" ? "bg-copper-300" : "bg-copper-500"}`}
          />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ${
          tone === "light" ? "text-white" : "text-bark-900"
        }`}
      >
        {title}
      </h2>
      {text ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            tone === "light" ? "text-bark-200" : "text-bark-500"
          }`}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
