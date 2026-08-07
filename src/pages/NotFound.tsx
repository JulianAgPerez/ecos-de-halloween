import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

const LostTravelerScene: FC = () => {
  const reduce = Boolean(useReducedMotion());

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mt-2 h-56 w-full max-w-xl overflow-hidden rounded-xl border border-purple-900/40 bg-gradient-to-b from-[#0c091c] via-[#141126] to-black"
    >
      <div className="absolute right-8 top-4 h-14 w-14 rounded-full bg-amber-100/10 blur-md" />
      <motion.div
        className="absolute right-10 top-6 h-8 w-8 rounded-full bg-amber-100/90"
        animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M40 240 L100 90 L160 240 Z" fill="#151030" />
        <path d="M55 240 L100 120 L145 240 Z" fill="#0b0817" />
        <path d="M180 240 L250 55 L320 240 Z" fill="#0d0a1f" />
        <path d="M205 240 L250 105 L295 240 Z" fill="#1a1536" />
        <path d="M250 240 L330 95 L410 240 Z" fill="#110f28" />
      </svg>

      <motion.div
        className="absolute bottom-6 left-1/2 h-24 w-64 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to top, rgba(251,191,36,0.28), rgba(251,191,36,0.05) 45%, transparent 75%)",
        }}
        animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-10 left-0 h-6 w-full bg-purple-100/5 blur-lg"
        animate={reduce ? {} : { x: [-26, 26, -26] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-4 left-0 h-4 w-3/4 bg-purple-100/5 blur-md"
        animate={reduce ? {} : { x: [24, -24, 24] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        animate={reduce ? {} : { opacity: [0.95, 1, 0.95] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute -top-4 right-4 h-16 w-16 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.6), transparent 70%)",
          }}
          animate={reduce ? {} : { opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg viewBox="0 0 120 100" className="h-28 w-32">
          <circle cx="60" cy="34" r="20" fill="#07040d" />
          <path
            d="M60 52 C78 54 92 64 95 88 L95 100 L25 100 L25 88 C28 64 42 54 60 52 Z"
            fill="#07040d"
          />
          <path
            d="M95 64 L110 70 L116 56"
            stroke="#07040d"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="108" y="44" width="12" height="16" rx="2" fill="#fbbf24" />
          <rect x="111" y="47" width="6" height="10" rx="1" fill="#fef3c7" />
          <rect x="113" y="40" width="2" height="5" fill="#07040d" />
        </svg>
      </motion.div>
    </div>
  );
};

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center">
        <p className="font-creepster text-9xl text-amber-400 [text-shadow:0_0_20px_rgba(251,191,36,0.6)]">
          404
        </p>
        <LostTravelerScene />
        <p className="mt-6 text-xl text-gray-200">Te perdiste en la noche...</p>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          Esta página no existe o fue tragada por la oscuridad. Mejor vuelve a
          un lugar seguro.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 rounded-lg bg-purple-800/60 px-6 py-3 text-lg text-amber-300 transition hover:bg-purple-700/80"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;