import { FC } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { FaQuestion } from "react-icons/fa";

interface Trivia {
  fact: string;
  icon: IconType;
}

const TRIVIA: Trivia[] = [
  {
    icon: FaQuestion,
    fact: "El origen del truco o trato se remonta al Samhain celta, cuando se dejaban ofrendas de comida a los espíritus.",
  },
  {
    icon: FaQuestion,
    fact: "La calabaza tallada tiene su origen en Irlanda, donde se usaban nabos antes de descubrir la calabaza.",
  },
  {
    icon: FaQuestion,
    fact: "El negro y el naranja son los colores de Halloween porque el naranja recuerda la cosecha y el negro la muerte.",
  },
  {
    icon: FaQuestion,
    fact: "En la Edad Media se creía que los gatos negros eran ayudantes de brujas, y por eso se los temía.",
  },
];

const HalloweenTrivia: FC = () => (
  <div className="mx-auto w-full max-w-6xl px-5 py-16">
    <motion.h3
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center font-creepster text-3xl md:text-4xl text-amber-400"
    >
      ¿Sabías que...?
    </motion.h3>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {TRIVIA.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative flex items-start gap-4 rounded-2xl border border-purple-800/50 bg-black/25 p-6 transition hover:border-amber-400/50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-amber-400 transition group-hover:rotate-12">
              <Icon size={18} />
            </span>
            <p className="text-gray-300">{item.fact}</p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default HalloweenTrivia;