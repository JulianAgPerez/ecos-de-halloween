import { motion, useInView, useScroll } from "framer-motion";
import { useEffect } from "react";

const ScrollingCircle = ({
  refProp,
}: {
  refProp: React.RefObject<HTMLDivElement>;
}) => {
  const { scrollYProgress } = useScroll({
    target: refProp,
    offset: ["start start", "end end"],
  });
  const isInView = useInView(refProp, { root: refProp, amount: 0.5 });

  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);

  return (
    <div ref={refProp}>
      {isInView ? null : (
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
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#00FF00" // Color del círculo de progreso
              strokeWidth="10"
              style={{ pathLength: scrollYProgress }} // Controlamos el "llenado"
            />
          </motion.svg>
        </figure>
      )}
    </div>
  );
};

export default ScrollingCircle;
