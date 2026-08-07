import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

const LostTravelerScene: FC = () => {
  const reduce = Boolean(useReducedMotion());

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mt-2 h-56 w-full max-w-xl overflow-hidden rounded-xl border border-purple-900/40 bg-gradient-to-b from-[#0d0a1e] via-[#141126] to-black"
    >
      <div className="absolute right-7 top-4 h-14 w-14 rounded-full bg-amber-100/10 blur-md" />
      <motion.div
        className="absolute right-9 top-6 h-8 w-8 rounded-full bg-amber-100/90"
        animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M40 240 L105 95 L170 240 Z" fill="#0b0817" />
        <path d="M52 240 L105 130 L158 240 Z" fill="#151030" />
        <path d="M185 240 L268 55 L350 240 Z" fill="#0d0a1d" />
        <path d="M205 240 L268 110 L330 240 Z" fill="#191436" />
        <path d="M300 240 L348 130 L396 240 Z" fill="#0b0817" />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black to-transparent" />

      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
        animate={reduce ? {} : { rotate: [-1.5, 1.5, -1.5] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute bottom-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.55), transparent 70%)",
          }}
          animate={reduce ? {} : { opacity: [0.55, 1, 0.55], scale: [1, 1.12, 1] }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <svg width="72" height="100" viewBox="0 0 60 90">
          <path
            d="M30 12 a10 10 0 1 0 0.001 0 Z"
            fill="#05040c"
          />
          <path
            d="M16 22 C16 34 10 44 10 62 L10 90 L50 90 L50 62 C50 44 44 34 44 22 C44 30 40 34 30 34 C20 34 16 30 16 22 Z"
            fill="#05040c"
          />
          <path d="M16 34 L2 12 L2 2" stroke="#05040c" strokeWidth="6" strokeLinecap="round" fill="none" />
          <rect x="0" y="0" width="10" height="14" rx="2" fill="#fbbf24" />
          <rect x="2" y="2" width="6" height="10" rx="1" fill="#fef3c7" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-9 left-0 h-6 w-full bg-purple-100/5 blur-lg"
        animate={reduce ? {} : { x: [-28, 28, -28] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-3 left-0 h-4 w-3/4 bg-purple-100/5 blur-md"
        animate={reduce ? {} : { x: [24, -24, 24] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
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