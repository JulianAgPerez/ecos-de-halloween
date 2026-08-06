import { FC } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import witchGif from "../../assets/images/witch-gif.gif";

type WitchMode = "fixed" | "anchored" | "hybrid";

// Cambiar este valor para probar los 3 modos de viaje de la bruja:
// - "fixed":    compañera fija que cruza el centro del viewport con el scroll.
// - "anchored": vive en la página y desciende por las escenas con el scroll.
// - "hybrid":   anclada a la página + al arrastrarla se despega y vuelve a la ruta.
const WITCH_MODE: WitchMode = "fixed";

const WITCH_SIZE = 64;

const DraggableWitch: FC<{ snapBack: boolean }> = ({ snapBack }) => (
  <motion.img
    src={witchGif}
    alt=""
    aria-hidden="true"
    draggable={false}
    drag
    dragMomentum={false}
    dragSnapToOrigin={snapBack}
    whileDrag={{ scale: 1.15 }}
    className="cursor-grab active:cursor-grabbing"
    style={{ width: WITCH_SIZE, height: WITCH_SIZE }}
  />
);

const WitchJourney: FC = () => {
  const { scrollYProgress } = useScroll();

  const fixedX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["-38vw", "0vw", "28vw"],
  );
  const fixedY = useTransform(scrollYProgress, [0, 1], ["0vh", "58vh"]);
  const fixedOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);
  const fixedScale = useTransform(scrollYProgress, [0, 0.6], [0.8, 1.15]);

  const anchoredY = useTransform(scrollYProgress, [0.08, 0.95], ["4vh", "260vh"]);
  const anchoredX = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    ["-3vw", "0vw", "7vw"],
  );
  const anchoredOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  if (WITCH_MODE === "fixed") {
    return (
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-[16%] z-40"
        style={{ x: fixedX, y: fixedY, opacity: fixedOpacity, scale: fixedScale }}
      >
        <div className="pointer-events-auto">
          <DraggableWitch snapBack />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[100vh] z-30"
      style={{ x: anchoredX, y: anchoredY, opacity: anchoredOpacity }}
    >
      <div className="pointer-events-auto">
        <DraggableWitch snapBack={WITCH_MODE === "hybrid"} />
      </div>
    </motion.div>
  );
};

export default WitchJourney;