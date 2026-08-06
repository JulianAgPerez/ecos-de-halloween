import { FC } from "react";

interface HorrorEasterEggsProps {
  variant: "forest" | "caves" | "underworld";
}

const BATS = [
  { left: "12%", top: "20%", delay: "0s", dur: "9s", s: 26 },
  { left: "34%", top: "34%", delay: "2.5s", dur: "11s", s: 20 },
  { left: "58%", top: "18%", delay: "1s", dur: "10s", s: 30 },
  { left: "82%", top: "30%", delay: "4s", dur: "12s", s: 22 },
];

const Bat: FC<{ size: number; delay: string; dur: string }> = ({
  size,
  delay,
  dur,
}) => (
  <svg
    viewBox="0 0 24 24"
    style={{ width: size, height: size, animation: `bat-fly ${dur} ease-in-out ${delay} infinite` }}
    className="drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]"
  >
    <path
      d="M12 14c-2-4-6-5-6-5 1 2 1 4-1 5 1-1 2-1 3 0l-1 4c4-1 8 2 11-1-2-3-4-2-6-0z"
      fill="#000"
      opacity="0.85"
    />
  </svg>
);

const SPIDERS = [
  { left: "20%", top: "40%", delay: "0s", dur: "7s", size: 22 },
  { left: "70%", top: "30%", delay: "3s", dur: "9s", size: 18 },
];

const Spider: FC<{ size: number; delay: string; dur: string }> = ({
  size,
  delay,
  dur,
}) => (
  <svg
    viewBox="0 0 32 32"
    style={{ width: size, height: size, animation: `spider-drop ${dur}s ease-in-out ${delay} infinite` }}
  >
    <circle cx="16" cy="14" r="7" fill="#0d0b1c" opacity="0.9" />
    <g stroke="#0d0b1c" strokeWidth="1.6" fill="none">
      <line x1="16" y1="-6" x2="16" y2="8" />
      <line x1="2" y1="10" x2="30" y2="10" />
      <line x1="6" y1="8" x2="12" y2="12" />
      <line x1="26" y1="8" x2="20" y2="12" />
      <line x1="6" y1="12" x2="12" y2="16" />
      <line x1="26" y1="12" x2="20" y2="16" />
    </g>
  </svg>
);

const CANDLES = [
  { left: "8%", delay: "0s", dur: "1.8s" },
  { left: "24%", delay: "0.8s", dur: "2.2s" },
  { left: "70%", delay: "0.4s", dur: "1.6s" },
  { left: "88%", delay: "1.2s", dur: "2.4s" },
];

const Candle: FC<{ delay: string; dur: string }> = ({ delay, dur }) => (
  <svg
    viewBox="0 0 20 60"
    style={{ width: 16, height: 60 }}
    className="opacity-80"
    aria-hidden="true"
  >
    <rect x="6" y="16" width="8" height="44" rx="2" fill="#b8a37a" opacity="0.9" />
    <rect x="8" y="2" width="4" height="10" rx="2" fill="#e5d6b8" opacity="0.9" />
    <path
      d="M10 0 Q14 8 10 14 Q6 8 10 0 Z"
      fill="#fbbf24"
      style={{ animation: `candle-flicker ${dur} ease-in-out ${delay} infinite` }}
    />
  </svg>
);

const HorrorEasterEggs: FC<HorrorEasterEggsProps> = ({ variant }) => {
  if (variant === "forest") {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {BATS.map((b, i) => (
          <span key={i} className="absolute" style={{ left: b.left, top: b.top }}>
            <Bat size={b.size} delay={b.delay} dur={b.dur} />
          </span>
        ))}
      </div>
    );
  }

  if (variant === "caves") {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {SPIDERS.map((s, i) => (
          <span key={i} className="absolute" style={{ left: s.left, top: s.top }}>
            <Spider size={s.size} delay={s.delay} dur={s.dur} />
          </span>
        ))}
        <span
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-creepster text-4xl text-purple-900/40"
          style={{ animation: "float-slow 6s ease-in-out infinite" }}
        >
          ☠
        </span>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {CANDLES.map((c, i) => (
        <span key={i} className="absolute bottom-6" style={{ left: c.left }}>
          <Candle delay={c.delay} dur={c.dur} />
        </span>
      ))}
    </div>
  );
};

export default HorrorEasterEggs;