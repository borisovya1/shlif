import type { SVGProps } from "react";

import type { IconName } from "@/lib/services";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const PhoneIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  </Svg>
);

export const MailIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </Svg>
);

export const PinIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);

export const ClockIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Svg>
);

export const CheckIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const CloseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const MenuIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const PlusIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const ShieldIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 3l7 3v5.5c0 4.4-3 8.1-7 9.5-4-1.4-7-5.1-7-9.5V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const StarIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.6Z" />
  </svg>
);

const serviceIcons: Record<IconName, React.ReactNode> = {
  sanding: (
    <>
      <path d="M3 16.5 16.5 3l4.5 4.5L7.5 21H3v-4.5Z" />
      <path d="m13.5 6 4.5 4.5" />
      <path d="M6 14.5 9.5 18" />
    </>
  ),
  paint: (
    <>
      <rect x="3" y="4" width="13" height="6" rx="1.5" />
      <path d="M16 7h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6" />
      <path d="M13 13v2.5a1.5 1.5 0 0 0 1.5 1.5h.5a1.5 1.5 0 0 1 1.5 1.5V21h-6v-2.5A1.5 1.5 0 0 1 12 17" />
    </>
  ),
  seam: (
    <>
      <path d="M3 8h18M3 16h18" />
      <path d="M6 12h12" strokeDasharray="3 3" />
      <path d="M3 4v16M21 4v16" />
    </>
  ),
  finishing: (
    <>
      <path d="M4 20h16" />
      <path d="M6 20V9l6-5 6 5v11" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18M4 12h16" />
    </>
  ),
  door: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <circle cx="15.5" cy="12" r="1" />
    </>
  ),
  roof: (
    <>
      <path d="m2 12 10-8 10 8" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  engineering: (
    <>
      <path d="M14.5 3.5a4.5 4.5 0 0 0-6 6L3 15v6h6l5.5-5.5a4.5 4.5 0 0 0 6-6l-3 3-3-3 3-3Z" />
    </>
  ),
  build: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-5h6v5" />
      <path d="M9 11h6" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l6 4V10l6 4V6l6 3v12H3Z" />
      <path d="M8 21v-4M14 21v-4" />
    </>
  ),
  wall: (
    <>
      <path d="M3 5h18v14H3z" />
      <path d="M3 12h18M9 5v7M15 12v7" />
    </>
  ),
  floor: (
    <>
      <path d="M3 7h18M3 12h18M3 17h18" />
      <path d="M9 7v5M15 12v5" />
    </>
  ),
  log: (
    <>
      <ellipse cx="7" cy="12" rx="3.5" ry="8" />
      <path d="M7 4h10a3.5 8 0 0 1 0 16H7" />
      <ellipse cx="7" cy="12" rx="1.2" ry="3" />
    </>
  ),
  beam: (
    <>
      <path d="m3 8 9-4 9 4v8l-9 4-9-4V8Z" />
      <path d="m3 8 9 4 9-4M12 12v8" />
    </>
  ),
};

export function ServiceIcon({ name, ...props }: IconProps & { name: IconName }) {
  return <Svg {...props}>{serviceIcons[name]}</Svg>;
}
