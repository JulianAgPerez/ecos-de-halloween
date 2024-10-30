import { FC, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  text: string;
}

const ParallaxBackground: FC<ParallaxProps> = ({ text }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div
      ref={ref}
      className="relative h-screen overflow-hidden grid place-items-center"
    >
      <motion.h1
        style={{ y: textY }}
        className="font-creepster text-white text-6xl md:text-9xl font-bold text-center z-20 relative"
      >
        {text}
      </motion.h1>
      <motion.div
        className="absolute inset-0 bg-cover bg-home-principal bg-bottom"
        style={{
          y: backgroundY,
        }}
      />
      <div className="absolute inset-0 z-19 bg-home-piso md:bg-home-secundaria-clean bg-cover bg-bottom" />
    </div>
  );
};

export default ParallaxBackground;
