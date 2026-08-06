import { FC, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  getBackgroundSrcSet,
  getOptimizedBackgroundUrl,
} from "../../utils/cloudinary";

interface StoryBackgroundProps {
  imageUrl?: string;
  fallbackBgClass?: string;
}

const SCALE = 1.25;
const Y_RANGE_PCT = -7;

const StoryBackground: FC<StoryBackgroundProps> = ({
  imageUrl,
  fallbackBgClass = "bg-home-principal",
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${Y_RANGE_PCT}%`]);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
      {imageUrl ? (
        <motion.img
          src={getOptimizedBackgroundUrl(imageUrl)}
          srcSet={getBackgroundSrcSet(imageUrl)}
          sizes="100vw"
          alt=""
          decoding="async"
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ y, scale: SCALE }}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <motion.div
          style={{ y, scale: SCALE }}
          className={`h-full w-full bg-cover bg-center ${fallbackBgClass}`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/75" />
      <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-purple-900/50 via-transparent to-amber-500/10" />
    </div>
  );
};

export default StoryBackground;