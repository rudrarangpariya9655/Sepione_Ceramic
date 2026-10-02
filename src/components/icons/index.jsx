/**
 * Sepione icon system.
 *
 * A single, consistent set of line icons drawn on a 24x24 grid with a 1.5
 * stroke and round joins, so every icon on the site reads as one family.
 * All icons inherit `currentColor`, which keeps them on-brand wherever the
 * surrounding text color changes.
 */

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

function Svg({ size = 24, className = "", children, ...rest }) {
  return (
    <svg {...base} width={size} height={size} className={className} {...rest}>
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- product */

export function ShieldIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2.75 4.75 5.5v5.4c0 4.25 3.05 8.2 7.25 9.35 4.2-1.15 7.25-5.1 7.25-9.35V5.5L12 2.75Z" />
      <path d="m9.1 11.9 2.05 2.05 3.75-3.9" />
    </Svg>
  );
}

export function DropletIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.2c3.2 3.4 5.4 6 5.4 8.8a5.4 5.4 0 0 1-10.8 0c0-2.8 2.2-5.4 5.4-8.8Z" />
      <path d="M9.6 12.6a2.6 2.6 0 0 0 2.6 2.6" />
    </Svg>
  );
}

export function GlobeIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.75h17.6M3.2 14.25h17.6" />
      <path d="M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </Svg>
  );
}

export function AwardIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="9" r="5.25" />
      <path d="m8.4 13.4-1.65 7.35L12 17.6l5.25 3.15-1.65-7.35" />
    </Svg>
  );
}

export function GemIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6.25 3.25h11.5l3 5.25L12 20.75 2.5 8.5l3.75-5.25Z" />
      <path d="M2.5 8.5h19" />
      <path d="m9.4 8.5 2.6 12.25L14.6 8.5" />
      <path d="m6.25 3.25 3.15 5.25M17.75 3.25 14.6 8.5" />
    </Svg>
  );
}

export function LayersIcon(props) {
  return (
    <Svg {...props}>
      <path d="m12 2.75 9 4.75-9 4.75-9-4.75 9-4.75Z" />
      <path d="m3 12.5 9 4.75 9-4.75" />
      <path d="m3 17.25 9 4.75 9-4.75" />
    </Svg>
  );
}

export function KilnIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21.5a6.75 6.75 0 0 0 6.75-6.75c0-3.9-2.9-6.6-4.4-9.1C13 3.6 12 2.5 12 2.5s-.6 2.9-2.35 5.4C7.85 10.2 5.25 11.6 5.25 14.75A6.75 6.75 0 0 0 12 21.5Z" />
      <path d="M12 21.5a2.9 2.9 0 0 0 2.9-2.9c0-1.75-1.45-2.5-2.9-4.85-1.45 2.35-2.9 3.1-2.9 4.85a2.9 2.9 0 0 0 2.9 2.9Z" />
    </Svg>
  );
}

export function PackageIcon(props) {
  return (
    <Svg {...props}>
      <path d="m12 2.75 8.5 4.5v9.5L12 21.25 3.5 16.75v-9.5L12 2.75Z" />
      <path d="M3.5 7.25 12 11.75l8.5-4.5" />
      <path d="M12 11.75v9.5" />
      <path d="m7.75 5 8.5 4.5" />
    </Svg>
  );
}

export function GridIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.25" y="3.25" width="7.5" height="7.5" rx="1.25" />
      <rect x="13.25" y="3.25" width="7.5" height="7.5" rx="1.25" />
      <rect x="3.25" y="13.25" width="7.5" height="7.5" rx="1.25" />
      <rect x="13.25" y="13.25" width="7.5" height="7.5" rx="1.25" />
    </Svg>
  );
}

/* ---------------------------------------------------------------- contact */

export function MapPinIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21.25s7-5.6 7-10.9a7 7 0 1 0-14 0c0 5.3 7 10.9 7 10.9Z" />
      <circle cx="12" cy="10.1" r="2.6" />
    </Svg>
  );
}

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M21.25 16.9v2.35a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3.03 19.15 19.15 0 0 1-5.9-5.9A19.5 19.5 0 0 1 1.62 3.8a2 2 0 0 1 2-2.2h2.35a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.46 2.1L7.22 9.22a15.75 15.75 0 0 0 5.9 5.9l1.02-1.02a2 2 0 0 1 2.1-.45c.9.33 1.83.56 2.79.69a2 2 0 0 1 1.72 2.03Z" />
    </Svg>
  );
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" />
      <path d="m3.4 6.4 8.6 6.1 8.6-6.1" />
    </Svg>
  );
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 6.75V12l3.4 2" />
    </Svg>
  );
}

/* ------------------------------------------------------------------- ui */

export function DocumentIcon(props) {
  return (
    <Svg {...props}>
      <path d="M13.5 2.75H6.25a1.5 1.5 0 0 0-1.5 1.5v15.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5V8.5L13.5 2.75Z" />
      <path d="M13.5 2.75V8.5h5.75M8.25 12.5h7.5M8.25 16.5h5" />
    </Svg>
  );
}

export function DownloadIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.25v11.5m-4-4 4 4 4-4M4.25 15.75v3.5a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5v-3.5" />
    </Svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4.5 12h14.25" />
      <path d="m13 6.25 5.75 5.75L13 17.75" />
    </Svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.25 7H17v8.75" />
    </Svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="m6.25 9.25 5.75 5.75 5.75-5.75" />
    </Svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}
