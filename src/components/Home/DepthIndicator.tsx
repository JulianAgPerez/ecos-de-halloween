import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FaTree, FaMountain, FaGem, FaFire } from "react-icons/fa";

const LAYERS = [
  { key: "forest", label: "Bosque", icon: FaTree },
  { key: "subsoil", label: "Subterráneo", icon: FaMountain },
  { key: "caves", label: "Cuevas", icon: FaGem },
  { key: "underworld", label: "Inframundo", icon: FaFire },
];

const DepthIndicator = () => {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const step = Math.min(LAYERS.length - 1, Math.floor(value * LAYERS.length));
    setActive(step);
  });

  return (
    <div
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500">
        Profundidad
      </div>
      <div className="flex flex-col items-center gap-3">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          const isActive = i === active;
          const isPast = i < active;
          return (
            <div key={layer.key} className="flex flex-col items-center">
              {i > 0 && (
                <div
                  className={`w-px h-4 transition-colors duration-500 ${
                    isPast || isActive ? "bg-amber-500/70" : "bg-gray-700"
                  }`}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: isActive ? 1 : isPast ? 0.6 : 0.35,
                  color: isActive ? "#f59e0b" : isPast ? "#a78bfa" : "#4b5563",
                }}
                transition={{ duration: 0.4 }}
                title={layer.label}
              >
                <Icon size={18} />
              </motion.div>
              {isActive && (
                <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-amber-400">
                  {layer.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepthIndicator;