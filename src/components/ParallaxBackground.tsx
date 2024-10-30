// ParallaxBackground.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxBackgroundProps {
  backgroundImageUrl?: string;
  defaultBackgroundClass: string;
  children: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  backgroundImageUrl,
  defaultBackgroundClass,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Transformaciones para el parallax
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div ref={ref} className="relative w-full h-screen overflow-hidden">
      <motion.div
        className={`absolute inset-0 bg-cover bg-center ${
          backgroundImageUrl ? "" : defaultBackgroundClass
        }`}
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : undefined,
          y: backgroundY,
        }}
      />
      {children}
    </div>
  );
};

export default ParallaxBackground;
