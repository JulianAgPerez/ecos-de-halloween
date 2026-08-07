import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface GhostLoaderProps {
  label?: string;
}

const GhostSVG: FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size * 1.25}
    viewBox="0 0 100 130"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ghost-grad" x1="0" y1="0" x2="0" y2="1">
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
      fill="url(#ghost-grad)"
    />
    <ellipse cx="38" cy="48" rx="7" ry="10" fill="#171229" />
    <ellipse cx="62" cy="48" rx="7" ry="10" fill="#171229" />
    <circle cx="40" cy="44" r="2.6" fill="#ffffff" opacity="0.9" />
    <circle cx="64" cy="44" r="2.6" fill="#ffffff" opacity="0.9" />
  </svg>
);

const GhostLoader: FC<GhostLoaderProps> = ({ label }) => {
  const reduce = Boolean(useReducedMotion());

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen cursor-default flex-col items-center justify-center bg-custom-purple select-none"
    >
      <span className="sr-only">{label ?? "Cargando"}</span>

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
            <GhostSVG size={120} />
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

      <p className="mt-8 font-creepster text-xl tracking-widest text-amber-300/80">
        {label ?? "Cargando…"}
      </p>
    </div>
  );
};

export default GhostLoader;