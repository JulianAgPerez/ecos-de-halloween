import { FC } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import {
  FaHeadphones,
  FaImage,
  FaMoon,
  FaCompactDisc,
} from "react-icons/fa";

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: FaHeadphones,
    title: "Sonidos de ambiente",
    description:
      "Cada historia puede llevar su propio audio de fondo para sumergirte por completo en el miedo.",
  },
  {
    icon: FaImage,
    title: "Fondos inmersivos",
    description:
      "Elegí la imagen que ambienta cada historia y hacé que el escenario se sienta real.",
  },
  {
    icon: FaCompactDisc,
    title: "Tu playlist",
    description:
      "Conectá la música con la que escribo para que la lectura tenga su propia banda sonora.",
  },
  {
    icon: FaMoon,
    title: "Modo nocturno",
    description:
      "Una lectura cómoda incluso en la oscuridad, sin sacrificar la atmósfera.",
  },
];

const FeatureCards: FC = () => (
  <div className="mx-auto w-full max-w-6xl px-5 py-16">
    <motion.h3
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center font-creepster text-3xl md:text-4xl text-amber-400"
    >
      Una experiencia inmersiva
    </motion.h3>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center rounded-2xl border border-purple-800/50 bg-black/25 p-6 text-center transition hover:border-purple-500/70"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20 text-amber-400">
              <Icon size={24} />
            </span>
            <h4 className="text-lg font-bold text-white">{feature.title}</h4>
            <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default FeatureCards;