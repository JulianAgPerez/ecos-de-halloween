import { FC, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import witchGif from "../../assets/images/witch-gif.gif";

const WITCH_SIZE = 64;

const DraggableWitch: FC = () => (
  <motion.img
    src={witchGif}
    alt=""
    aria-hidden="true"
    draggable={false}
    drag
    dragMomentum={false}
    dragSnapToOrigin
    whileDrag={{ scale: 1.15 }}
    className="cursor-grab active:cursor-grabbing"
    style={{ width: WITCH_SIZE, height: WITCH_SIZE }}
  />
);

const WitchJourney: FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const reduce = Boolean(useReducedMotion());

  const viewportHeight = useMotionValue(window.innerHeight);

  useEffect(() => {
    const update = () => viewportHeight.set(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [viewportHeight]);

  const anchoredY = useTransform(
    [scrollY, viewportHeight],
    ([scroll, vh]: number[]) => Math.max(0, scroll - vh),
  );
  const anchoredX = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    ["-3vw", "0vw", "7vw"],
  );
  const anchoredOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const containerTop = useTransform(viewportHeight, (vh) => vh * 1.8);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 z-30"
      style={{
        top: containerTop,
        x: reduce ? 0 : anchoredX,
        y: anchoredY,
        opacity: reduce ? 1 : anchoredOpacity,
      }}
    >
      <div className="pointer-events-auto">
        <DraggableWitch />
      </div>
    </motion.div>
  );
};

export default WitchJourney;
