import { FC, ReactNode, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  getBackgroundSrcSet,
  getOptimizedBackgroundUrl,
  getPortraitBackgroundSrcSet,
} from "../utils/cloudinary";

interface ParallaxBackgroundProps {
  imageUrl?: string;
  fallbackBgClass?: string;
  title?: ReactNode;
  titleClassName?: string;
  className?: string;
  textSpeed?: number;
  fadeTitle?: boolean;
}

const ParallaxBackground: FC<ParallaxBackgroundProps> = ({
  imageUrl,
  fallbackBgClass,
  title,
  titleClassName,
  className = "",
  textSpeed = 200,
  fadeTitle = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "11%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", `${textSpeed}%`]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const backgroundStyle = { y: backgroundY, scale: backgroundScale };

  return (
    <div
      ref={containerRef}
      className={`relative h-screen supports-[height:100svh]:h-[100svh] overflow-hidden ${className}`}
    >
      {imageUrl ? (
<picture className="absolute inset-0" aria-hidden="true">
          <source
            media="(max-width: 640px)"
            srcSet={getPortraitBackgroundSrcSet(imageUrl)}
            sizes="100vw"
          />
          <motion.img
            src={getOptimizedBackgroundUrl(imageUrl)}
            srcSet={getBackgroundSrcSet(imageUrl)}
            sizes="100vw"
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[-16%] h-[132%] w-full object-cover object-center"
            style={backgroundStyle}
          />
        </picture>
      ) : fallbackBgClass ? (
        <motion.div
          aria-hidden="true"
          className={`absolute left-0 right-0 top-[-16%] h-[132%] w-full bg-cover bg-center ${fallbackBgClass}`}
          style={backgroundStyle}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/85" />

      {title && (
        <div
          className={`relative z-20 h-full w-full grid place-items-center ${titleClassName ?? ""}`}
        >
          <motion.div
            style={{ y: titleY, opacity: fadeTitle ? titleOpacity : 1 }}
          >
            {title}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParallaxBackground;
