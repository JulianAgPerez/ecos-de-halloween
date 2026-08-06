interface CaveDecorProps {
  density?: "light" | "medium" | "heavy";
}

const STALACTITE_SIZES = [
  { left: "0%", w: 90, h: 160 },
  { left: "12%", w: 60, h: 220 },
  { left: "26%", w: 110, h: 120 },
  { left: "38%", w: 50, h: 260 },
  { left: "52%", w: 130, h: 140 },
  { left: "66%", w: 70, h: 240 },
  { left: "80%", w: 100, h: 110 },
  { left: "92%", w: 55, h: 200 },
];

const CaveDecor = ({ density = "medium" }: CaveDecorProps) => {
  const visibleCount =
    density === "light" ? 4 : density === "heavy" ? STALACTITE_SIZES.length : 6;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-64 overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative h-full w-full">
        {STALACTITE_SIZES.slice(0, visibleCount).map((s, i) => (
          <svg
            key={i}
            viewBox="0 0 80 160"
            preserveAspectRatio="none"
            className="absolute top-0"
            style={{
              left: s.left,
              width: s.w,
              height: s.h,
              filter: `drop-shadow(0 6px 6px rgba(0,0,0,0.6))`,
            }}
          >
            <path
              d="M40,0 L60,70 Q40,160 40,160 Q40,160 20,70 Z"
              fill="#0d0b1c"
              opacity={0.9}
            />
            <path
              d="M40,0 L50,60 Q40,120 40,130 Q40,120 30,60 Z"
              fill="#191531"
              opacity={0.6}
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default CaveDecor;