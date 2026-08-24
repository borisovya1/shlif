import Image from "next/image";

/**
 * Универсальная обёртка для изображений.
 * Пока реального фото нет — рисуется аккуратная заглушка в фирменных цветах.
 * Чтобы подставить фото: положите файл в public/images и передайте src="/images/имя.jpg".
 */

const tones = [
  { from: "#3b2f24", to: "#6b543c" },
  { from: "#4a3524", to: "#8a6238" },
  { from: "#2f2a24", to: "#5d5245" },
  { from: "#52381f", to: "#9a6b34" },
  { from: "#3a3226", to: "#79684c" },
  { from: "#2b2119", to: "#6d4c2f" },
  { from: "#514334", to: "#a08863" },
  { from: "#5c3d1e", to: "#b07a3a" },
  { from: "#33302b", to: "#6f695f" },
  { from: "#452c1c", to: "#8d5a30" },
  { from: "#3d3a33", to: "#847c6c" },
  { from: "#5a4227", to: "#a37f4c" },
];

type PhotoProps = {
  src?: string;
  alt: string;
  tone?: number;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function Photo({
  src,
  alt,
  tone = 0,
  label,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: PhotoProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-bark-200 ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const palette = tones[tone % tones.length];

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 9px), linear-gradient(140deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 20% 10%, rgba(255,255,255,0.18) 0%, transparent 55%)",
        }}
      />
      {label ? (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}
