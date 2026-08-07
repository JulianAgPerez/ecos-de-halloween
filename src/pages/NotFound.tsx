import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

const Figure: FC<{ fill: string; filter: string }> = ({ fill, filter }) => (
  <g fill={fill} style={{ filter, transformOrigin: "center" }}>
    <path d="M-24 28 C -22 16 -22 8 -18 2 C -16 -8 -10 -16 -6 -22 C -4 -26 -2 -30 -1 -32 C 0 -35 3 -36 4 -32 C 5 -29 7 -26 7 -23 C 9 -18 11 -14 14 -10 C 18 -6 22 0 23 8 C 24 16 25 24 25 30 C 25 34 20 35 14 34 C 6 36 -2 36 -12 34 C -18 35 -24 33 -24 28 Z" />
    <ellipse cx="0" cy="4" rx="10" ry="16" fill="#050310" opacity="0.45" style={{ filter: "url(#soft)" }} />
  </g>
);

const LostTravelerScene: FC<{ reduce: boolean }> = ({ reduce }) => (
  <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#070514] via-[#0f0a2a] to-[#160f38]">
    <svg
      viewBox="0 0 320 220"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id="lanternGlow">
          <stop offset="0%" stopColor="#ffe0a0" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#ffb454" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffb454" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="echoGlow">
          <stop offset="0%" stopColor="#7c69ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c69ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* stars */}
      <g fill="#e8e4ff">
        <circle cx="30" cy="90" r="1.2" opacity="0.6" />
        <circle cx="150" cy="16" r="1" opacity="0.5" />
        <circle cx="252" cy="70" r="1.3" opacity="0.55" />
        <circle cx="294" cy="120" r="1" opacity="0.45" />
        <circle cx="120" cy="120" r="0.9" opacity="0.4" />
      </g>

      {/* moon with craters */}
      <g>
        <circle cx="56" cy="36" r="22" fill="#efe9ff" filter="url(#glow)" opacity="0.8" />
        <circle cx="56" cy="36" r="13" fill="#fbfaff" />
        <circle cx="51" cy="32" r="2.2" fill="#d9d2f0" opacity="0.8" />
        <circle cx="61" cy="39" r="1.5" fill="#d9d2f0" opacity="0.7" />
        <circle cx="59" cy="31" r="1.1" fill="#d9d2f0" opacity="0.6" />
      </g>

      {/* faint back trees */}
      <g fill="#0b0826" opacity="0.55">
        <path d="M70 176 C 76 144 82 118 96 96 C 96 118 96 144 96 176 Z" />
        <path d="M250 176 C 246 140 240 116 230 92 C 230 118 232 146 238 176 Z" />
      </g>

      {/* echo halos */}
      <motion.g
        animate={reduce ? {} : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="160" cy="96" rx="72" ry="92" fill="url(#echoGlow)" />
        <ellipse cx="160" cy="148" rx="54" ry="64" fill="url(#echoGlow)" />
      </motion.g>

      {/* the echoes, breathing */}
      <motion.g
        animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <g transform="translate(160 74) scale(2.2)">
          <Figure
            fill="rgba(126,109,255,0.5)"
            filter="drop-shadow(0 0 12px rgba(126,109,255,0.55))"
          />
        </g>
        <g transform="translate(160 132) scale(1.5)">
          <Figure
            fill="rgba(126,109,255,0.42)"
            filter="drop-shadow(0 0 10px rgba(126,109,255,0.6))"
          />
        </g>
      </motion.g>

      {/* rising lantern light revealing the echoes */}
      <ellipse
        cx="140"
        cy="120"
        rx="80"
        ry="120"
        fill="url(#lanternGlow)"
        opacity="0.2"
        style={{ filter: "url(#soft)" }}
      />
      <motion.ellipse
        cx="132"
        cy="190"
        rx="70"
        ry="80"
        fill="url(#lanternGlow)"
        opacity={reduce ? 0.5 : 0.55}
        animate={reduce ? {} : { opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* the traveler, foreground */}
      <g transform="translate(160 180) scale(1.15)">
        <Figure fill="#07050f" filter="drop-shadow(0 0 6px rgba(126,109,255,0.35))" />
      </g>

      {/* lantern at the traveler's feet */}
      <g>
        <path
          d="M124 186 C 122 184 122 182 125 181 L 139 181 C 142 182 142 184 140 186 L 138 204 C 138 207 135 208 132 208 C 129 208 126 207 126 204 Z"
          fill="#1c1006"
        />
        <rect x="128" y="186" width="8" height="13" rx="2" fill="#ffd580" />
        <rect x="130" y="188" width="4" height="9" rx="1" fill="#fff6dc" />
        <path
          d="M129 181 C 129 178 135 178 135 181"
          stroke="#1c1006"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <line x1="124" y1="181" x2="140" y2="181" stroke="#1c1006" strokeWidth="2" />
      </g>

      {/* side pines, soft curved boughs */}
      <g fill="#0a0720">
        <path d="M22 176 C 18 148 20 120 30 96 C 40 120 42 148 40 176 Z" />
        <path d="M6 176 C 4 152 8 128 16 110 C 22 128 24 152 22 176 Z" />
        <path d="M44 176 C 44 158 42 144 36 134 C 44 142 48 158 50 176 Z" />
      </g>
      <g fill="#0d0a28">
        <path d="M298 176 C 302 148 300 120 290 96 C 280 120 278 148 280 176 Z" />
        <path d="M314 176 C 316 152 312 128 304 110 C 298 128 296 152 298 176 Z" />
        <path d="M276 176 C 276 158 278 144 284 134 C 276 142 272 158 270 176 Z" />
      </g>

      {/* rising fireflies */}
      {[
        { x: 116, y: 172 },
        { x: 142, y: 160 },
        { x: 104, y: 150 },
        { x: 158, y: 140 },
        { x: 128, y: 128 },
        { x: 170, y: 120 },
        { x: 118, y: 108 },
      ].map((f, i) => (
        <motion.circle
          key={i}
          cx={f.x}
          cy={f.y}
          r={i % 2 === 0 ? 1.3 : 1}
          fill="#ffe08a"
          style={{ filter: "drop-shadow(0 0 3px rgba(255,224,138,0.9))" }}
          animate={
            reduce
              ? {}
              : { opacity: [0.2, 1, 0.2], y: [0, -14, 0] }
          }
          transition={{
            duration: 2.6 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
        />
      ))}

      {/* ground shadow */}
      <ellipse
        cx="160"
        cy="214"
        rx="110"
        ry="10"
        fill="#04020a"
        opacity="0.6"
        style={{ filter: "url(#soft)" }}
      />
    </svg>

    {/* drifting mist */}
    {[
      { top: "16%", height: "24%", delay: 0, dur: 13 },
      { top: "48%", height: "30%", delay: 2, dur: 16 },
      { top: "72%", height: "28%", delay: 4, dur: 14 },
    ].map((m, i) => (
      <motion.div
        key={i}
        className="absolute inset-x-0"
        style={{
          top: m.top,
          height: m.height,
          background:
            "linear-gradient(180deg, transparent, rgba(190,170,255,0.12), transparent)",
          filter: "blur(8px)",
        }}
        initial={{ x: reduce ? 0 : "-6%" }}
        animate={reduce ? {} : { x: ["-6%", "8%", "-6%"] }}
        transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
    ))}
  </div>
);

const NotFound: FC = () => {
  const navigate = useNavigate();
  const reduce = Boolean(useReducedMotion());

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center">
        <h1 className="sr-only">Página no encontrada</h1>
        <p className="font-creepster text-9xl text-amber-400 [text-shadow:0_0_20px_rgba(251,191,36,0.6)]">
          404
        </p>
        <div
          className="relative mx-auto mt-2 w-full max-w-xl overflow-hidden rounded-xl border border-purple-900/40"
          style={{ aspectRatio: "320 / 220" }}
        >
          <LostTravelerScene reduce={reduce} />
        </div>
        <p className="mt-6 text-xl text-gray-200">Los ecos se pierden en la noche...</p>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          Esta página no está en este mundo, o quedó atrapada entre ecos. Volvé
          a un lugar con luz.
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