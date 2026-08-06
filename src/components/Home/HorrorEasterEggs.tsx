import { FC } from "react";

const SPIDERS = [
  { left: "20%", top: "40%", delay: "0s", dur: "3.5s", size: 28 },
  { left: "70%", top: "30%", delay: "1.5s", dur: "4.5s", size: 24 },
];

const Spider: FC<{ size: number; delay: string; dur: string }> = ({
  size,
  delay,
  dur,
}) => (
  <svg
    viewBox="0 0 32 32"
    style={{
      width: size,
      height: size,
      animation: `spider-drop ${dur}s ease-in-out ${delay} infinite`,
      willChange: "transform",
    }}
    className="drop-shadow-[0_0_7px_rgba(168,85,247,0.6)]"
  >
    <circle cx="16" cy="14" r="7" fill="#241c44" opacity="0.95" />
    <g stroke="#3a2f66" strokeWidth="1.8" fill="none">
      <line x1="16" y1="-6" x2="16" y2="8" />
      <line x1="2" y1="10" x2="30" y2="10" />
      <line x1="6" y1="8" x2="12" y2="12" />
      <line x1="26" y1="8" x2="20" y2="12" />
      <line x1="6" y1="12" x2="12" y2="16" />
      <line x1="26" y1="12" x2="20" y2="16" />
    </g>
  </svg>
);

const HorrorEasterEggs: FC = () => (
  <div
    className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    aria-hidden="true"
  >
    {SPIDERS.map((s, i) => (
      <span key={i} className="absolute" style={{ left: s.left, top: s.top }}>
        <Spider size={s.size} delay={s.delay} dur={s.dur} />
      </span>
    ))}
  </div>
);

export default HorrorEasterEggs;