const DIVIDER_PALETTES: Record<
  "soil" | "rock" | "embers",
  { fill: string; stroke: string; glow?: string }
> = {
  soil: {
    fill: "#1E193A",
    stroke: "rgba(245,158,11,0.75)",
  },
  rock: {
    fill: "#141126",
    stroke: "rgba(168,85,247,0.6)",
  },
  embers: {
    fill: "#14060a",
    stroke: "#f97316",
    glow: "rgba(249,115,22,0.6)",
  },
};

interface DepthDividerProps {
  variant?: "soil" | "rock" | "embers";
  flip?: boolean;
}

const DepthDivider = ({ variant = "soil", flip = false }: DepthDividerProps) => {
  const { fill, stroke, glow } = DIVIDER_PALETTES[variant];
  return (
    <div
      className="relative z-20 -mt-10 md:-mt-14"
      aria-hidden="true"
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="block h-10 w-full md:h-14"
      >
        <path
          d="M1440,8 L1280,56 L1120,8 L960,56 L800,8 L640,56 L480,8 L320,56 L160,8 L0,56 L0,96 L1440,96 Z"
          fill={fill}
        />
        <path
          d="M1440,8 L1280,56 L1120,8 L960,56 L800,8 L640,56 L480,8 L320,56 L160,8 L0,56"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
        />
        {glow && (
          <path
            d="M0,96 L160,56 L320,96 L480,56 L640,96 L800,56 L960,96 L1120,56 L1280,96 L1440,56 L1440,96 Z"
            fill="none"
            stroke={glow}
            strokeWidth="1.5"
            opacity="0.4"
          />
        )}
      </svg>
    </div>
  );
};

export default DepthDivider;