import { FC } from "react";
import { IconType } from "react-icons";
import {
  FaHeadphones,
  FaImage,
  FaMoon,
  FaCompactDisc,
} from "react-icons/fa";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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
      "Elegí sonidos de ambiente que acompañen la lectura y te sumerjan por completo en el miedo.",
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
    <SectionHeading className="mb-8">Una experiencia inmersiva</SectionHeading>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <Reveal
            key={feature.title}
            delay={i * 0.1}
            className="glass-card flex flex-col items-center p-6 text-center transition hover:border-purple-500/70"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20 text-amber-400">
              <Icon size={24} />
            </span>
            <h4 className="text-lg font-bold text-white">{feature.title}</h4>
            <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
          </Reveal>
        );
      })}
    </div>
  </div>
);

export default FeatureCards;