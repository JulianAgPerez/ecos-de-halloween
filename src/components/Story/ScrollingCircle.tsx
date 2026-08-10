import { type RefObject, useLayoutEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ScrollingCircle = ({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement>;
}) => {
  const { scrollY } = useScroll();
  const [range, setRange] = useState({ start: 0, end: 1 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = targetRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const end = top + el.offsetHeight - window.innerHeight;
      setRange({ start: top, end: Math.max(end, top + 1) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [targetRef]);

  const progress = useTransform(
    scrollY,
    [range.start, range.end],
    [0, 1],
    { clamp: true },
  );

  return (
    <figure className="fixed top-6 left-1/2 transform -translate-x-1/2 z-15">
      <motion.svg
        width="50"
        height="50"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform rotate-[-90deg]"
      >
        {/* Círculo de fondo (sin progreso) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          pathLength="1"
          stroke="rgba(255, 255, 255, 0.2)" // Color del fondo del círculo
          strokeWidth="10"
        />
        {/* Círculo de progreso (animado) */}
        <motion.path
          d="M 50 5 A 45 45 0 1 1 49.99 5"
          stroke="#00FF00" // Color del círculo de progreso
          strokeWidth="10"
          style={{ pathLength: progress }} // Controlamos el "llenado"
        />
      </motion.svg>
    </figure>
  );
};

export default ScrollingCircle;
