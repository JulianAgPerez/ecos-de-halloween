import { FC } from "react";

interface CaveDecorProps {
  density?: "light" | "medium" | "heavy";
}

const STALACTITES = [
  { left: "0%", w: 90, h: 220 },
  { left: "9%", w: 55, h: 130 },
  { left: "18%", w: 120, h: 90 },
  { left: "28%", w: 48, h: 70 },
  { left: "38%", w: 140, h: 50 },
  { left: "52%", w: 65, h: 30 },
  { left: "64%", w: 110, h: 55 },
  { left: "74%", w: 50, h: 90 },
  { left: "84%", w: 105, h: 120 },
  { left: "94%", w: 60, h: 280 },
];

const STALAGMITES = [
  { left: "6%", w: 70, h: 120 },
  { left: "20%", w: 100, h: 160 },
  { left: "38%", w: 60, h: 100 },
  { left: "58%", w: 90, h: 140 },
  { left: "76%", w: 65, h: 110 },
  { left: "90%", w: 110, h: 180 },
];

const COLUMNS = [
  { left: "-2%", w: 90, h: 520 },
  { left: "auto", right: "-2%", w: 110, h: 560 },
];

interface SpikeProps {
  left: string;
  w: number;
  h: number;
}

const Spike: FC<SpikeProps> = ({ left, w, h }) => (
  <svg
    viewBox="0 0 80 160"
    preserveAspectRatio="none"
    className="absolute top-0"
    style={{
      left,
      width: w,
      height: h,
      filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.6))",
    }}
  >
    <path
      d="M40,0 L60,70 Q40,160 40,160 Q40,160 20,70 Z"
      fill="#0d0b1c"
      opacity="0.9"
    />
    <path
      d="M40,0 L50,60 Q40,120 40,130 Q40,120 30,60 Z"
      fill="#191531"
      opacity="0.6"
    />
  </svg>
);

const Column: FC<{ left?: string; right?: string; w: number; h: number }> = ({
  left,
  right,
  w,
  h,
}) => (
  <svg
    viewBox="0 0 80 160"
    preserveAspectRatio="none"
    className="absolute top-0"
    style={{
      left,
      right,
      width: w,
      height: h,
      filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.6))",
    }}
  >
    <path d="M20,0 L60,0 L70,160 L10,160 Z" fill="#0d0b1c" opacity="0.95" />
    <path d="M34,0 L46,0 L50,160 L30,160 Z" fill="#191531" opacity="0.5" />
  </svg>
);

const CaveDecor = ({ density = "medium" }: CaveDecorProps) => {
  const stalactiteCount =
    density === "light" ? 5 : density === "heavy" ? STALACTITES.length : 8;
  const stalagmiteCount =
    density === "light" ? 3 : density === "heavy" ? STALAGMITES.length : 4;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_40%,rgba(147,51,234,0.16),transparent_70%)]" />

      {COLUMNS.map((c, i) => (
        <Column
          key={`col-${i}`}
          left={c.left}
          right={c.right}
          w={c.w}
          h={c.h}
        />
      ))}

      {STALACTITES.slice(0, stalactiteCount).map((s, i) => (
        <Spike key={`t-${i}`} left={s.left} w={s.w} h={s.h} />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-64">
        {STALAGMITES.slice(0, stalagmiteCount).map((s, i) => (
          <div
            key={`g-${i}`}
            className="absolute bottom-0"
            style={{
              left: s.left,
              width: s.w,
              height: s.h,
              transform: "scaleY(-1)",
              filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.6))",
            }}
          >
            <svg
              viewBox="0 0 80 160"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="M40,0 L60,70 Q40,160 40,160 Q40,160 20,70 Z"
                fill="#0d0b1c"
                opacity="0.9"
              />
              <path
                d="M40,0 L50,60 Q40,120 40,130 Q40,120 30,60 Z"
                fill="#191531"
                opacity="0.6"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaveDecor;