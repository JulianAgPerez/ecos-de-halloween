import { type RefObject, useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

const IDLE_MS = 1500;

const DAY_COLORS = {
  track: "rgba(201, 160, 106, 0.25)",
  progress: "#c9a06a",
};

const NIGHT_COLORS = {
  track: "rgba(230, 197, 143, 0.18)",
  progress: "#e6c58f",
};

const ScrollingCircle = ({
  targetRef,
  nightMode = false,
}: {
  targetRef: RefObject<HTMLElement>;
  nightMode?: boolean;
}) => {
  const { scrollY, scrollYProgress: progress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const idleTimer = useRef<number | null>(null);
  const opacity = useSpring(0.3, { stiffness: 250, damping: 30 });

  const { track, progress: progressColor } = nightMode
    ? NIGHT_COLORS
    : DAY_COLORS;

  useEffect(
    () => () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    },
    []
  );

  useMotionValueEvent(scrollY, "change", () => {
    opacity.set(1);
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => opacity.set(0.3), IDLE_MS);
  });

  return (
    <motion.figure
      aria-hidden="true"
      style={{ opacity }}
      className="fixed bottom-5 right-5 z-20"
    >
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo de fondo (sin progreso) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          pathLength="1"
          stroke={track}
          strokeWidth="8"
        />
        {/* Círculo de progreso (animado) */}
        <motion.path
          d="M 50 5 A 45 45 0 1 1 49.99 5"
          stroke={progressColor}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
      </motion.svg>
    </motion.figure>
  );
};

export default ScrollingCircle;
