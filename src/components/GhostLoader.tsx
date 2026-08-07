import { FC, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type GhostVariant = "ghost" | "scene" | "minimal";

interface GhostLoaderProps {
  variant?: GhostVariant;
  label?: string;
}

const PAGE_BG = "#1E193A";

const NEXT_VARIANT: Record<GhostVariant, GhostVariant> = {
  ghost: "scene",
  scene: "minimal",
  minimal: "ghost",
};

const GhostSVG: FC<{ size: number; gradientId: string }> = ({
  size,
  gradientId,
}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 130" aria-hidden="true">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#c4b5fd" />
      </linearGradient>
    </defs>
    <path
      d="M50 8
         C80 8 92 34 92 62 L92 102
         Q84 92 76 102 Q68 112 60 102 Q52 92 44 102 Q36 112 28 102 Q20 92 12 102
         L12 62
         C8 34 20 8 50 8 Z"
      fill={`url(#${gradientId})`}
    />
    <ellipse cx="38" cy="48" rx="7" ry="10" fill="#171229" />
    <ellipse cx="62" cy="48" rx="7" ry="10" fill="#171229" />
    <circle cx="40" cy="44" r="2.6" fill="#ffffff" opacity="0.9" />
    <circle cx="64" cy="44" r="2.6" fill="#ffffff" opacity="0.9" />
  </svg>
);

const GhostScene: FC<{ reduce: boolean }> = ({ reduce }) => (
  <div className="relative flex h-64 w-52 items-end justify-center">
    <motion.div
      aria-hidden="true"
      className="absolute inset-8 rounded-full bg-purple-500/25 blur-2xl"
      animate={reduce ? { opacity: 0.5 } : { opacity: [0.3, 0.6, 0.3] }}
      transition={
        reduce ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    />
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={reduce ? {} : { y: [0, -16, 0], rotate: [-2, 2, -2] }}
        transition={
          reduce ? {} : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <GhostSVG gradientId="ghost-grad" size={120} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="-mt-1 h-3 w-20 rounded-full bg-black/40 blur-[3px]"
        animate={reduce ? {} : { scaleX: [1, 0.8, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={
          reduce ? {} : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  </div>
);

const Bat: FC<{ reduce: boolean }> = ({ reduce }) => (
  <motion.svg
    width="46"
    height="30"
    viewBox="0 0 46 30"
    className="absolute left-10 top-16"
    animate={reduce ? {} : { y: [0, -6, 0], x: [0, 4, 0] }}
    transition={
      reduce ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
    aria-hidden="true"
  >
    <ellipse cx="23" cy="16" rx="11" ry="7" fill="#171229" />
    <motion.path
      d="M12 14 L0 5 L3 16 L0 25 Z"
      fill="#171229"
      style={{ originX: 0.5, originY: 0.5 }}
      animate={reduce ? {} : { rotate: [-14, 12, -14] }}
      transition={{
        duration: 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.path
      d="M34 14 L46 5 L43 16 L46 25 Z"
      fill="#171229"
      style={{ originX: 0.5, originY: 0.5 }}
      animate={reduce ? {} : { rotate: [12, -14, 12] }}
      transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

const HalloweenScene: FC<{ reduce: boolean }> = ({ reduce }) => (
  <div className="relative h-64 w-64">
    <div className="absolute right-2 top-2">
      <div
        aria-hidden="true"
        className="absolute -inset-2 rounded-full bg-amber-100/20 blur-sm"
      />
      <svg viewBox="0 0 48 48" className="relative h-12 w-12" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#fde68a" />
        <circle cx="31" cy="22" r="22" fill={PAGE_BG} />
      </svg>
    </div>

    {[
      { top: "24%", left: "8%", delay: 0 },
      { top: "12%", left: "48%", delay: 0.7 },
      { top: "30%", left: "70%", delay: 0.3 },
    ].map((star, i) => (
      <motion.span
        key={i}
        aria-hidden="true"
        className="absolute h-1.5 w-1.5 rounded-full bg-amber-100/90"
        style={{ top: star.top, left: star.left }}
        animate={reduce ? { opacity: 0.7 } : { opacity: [0.2, 0.9, 0.2] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: star.delay,
        }}
      />
    ))}

    <Bat reduce={reduce} />

    <div className="absolute bottom-6 left-5 flex flex-col items-center">
      <motion.div
        aria-hidden="true"
        className="relative h-9 w-6"
        style={{ transformOrigin: "bottom center" }}
        animate={reduce ? {} : { scaleY: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-t-full rounded-b-md bg-orange-400 blur-[1px]" />
        <div className="absolute inset-0 scale-75 rounded-t-full rounded-b-md bg-amber-200 blur-[2px]" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="mt-1 h-2 w-8 rounded-full bg-amber-400/30 blur-[2px]"
        animate={reduce ? { opacity: 0.5 } : { opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
      <motion.div
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={
          reduce ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <GhostSVG gradientId="scene-ghost-grad" size={64} />
      </motion.div>
      <div
        aria-hidden="true"
        className="-mt-1 h-2 w-12 rounded-full bg-black/40 blur-[2px]"
      />
    </div>
  </div>
);

const MinimalMoon: FC<{ reduce: boolean }> = ({ reduce }) => (
  <div className="relative flex h-24 w-24 items-center justify-center">
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-full bg-amber-200/10 blur-md"
    />
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-hidden="true">
      <defs>
        <linearGradient id="moon-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="46"
        cy="40"
        r="26"
        fill="url(#moon-grad)"
        animate={reduce ? {} : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="40"
        cy="24"
        r="4"
        fill="#fbbf24"
        animate={reduce ? {} : { opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </svg>
  </div>
);

const VARIANTS: Record<GhostVariant, FC<{ reduce: boolean }>> = {
  ghost: GhostScene,
  scene: HalloweenScene,
  minimal: MinimalMoon,
};

const GhostLoader: FC<GhostLoaderProps> = ({ variant = "ghost", label }) => {
  const reduced = Boolean(useReducedMotion());
  const [current, setCurrent] = useState<GhostVariant>(variant);
  const Stage = VARIANTS[current];

  const cycleVariant = import.meta.env.DEV
    ? () => setCurrent((c) => NEXT_VARIANT[c])
    : undefined;

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={cycleVariant}
      title={cycleVariant ? "Clic para cambiar de variante (solo dev)" : undefined}
      className="flex min-h-screen cursor-default flex-col items-center justify-center bg-custom-purple select-none"
    >
      <span className="sr-only">{label ?? "Cargando"}</span>
      <Stage reduce={reduced} />
      <p className="mt-8 font-creepster text-xl tracking-widest text-amber-300/80">
        {label ?? "Cargando…"}
      </p>
    </div>
  );
};

export default GhostLoader;