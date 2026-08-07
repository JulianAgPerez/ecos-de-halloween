import { FC } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import witchGif from "../../assets/images/witch-gif.gif";

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

  const anchoredY = useTransform(
    scrollYProgress,
    [0.08, 0.95],
    ["4vh", "260vh"],
  );
  const anchoredX = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    ["-3vw", "0vw", "7vw"],
  );
  const anchoredOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[100vh] z-30"
      style={{ x: anchoredX, y: anchoredY, opacity: anchoredOpacity }}
    >
      <div className="pointer-events-auto">
        <DraggableWitch snapBack />
      </div>
    </motion.div>
  );
};

export default WitchJourney;