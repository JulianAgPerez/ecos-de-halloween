import { FC } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import {
  FaQuestion,
  FaGhost,
  FaSkull,
  FaBookDead,
  FaMoon,
  FaDragon,
} from "react-icons/fa";

interface Trivia {
  fact: string;
  icon: IconType;
}

const TRIVIA: Trivia[] = [
  {
    icon: FaQuestion,
    fact: "El origen del truco o trato se remonta al Samhain celta, cuando se derramaban ofrendas de comida para los espíritus.",
  },
  {
    icon: FaSkull,
    fact: "Edgar Allan Poe escribió 'The Raven' en 1845. La repetitiva 'Nevermore' se inspiró, según se cree, en el cuervo mascota del escritor Charles Dickens.",
  },
  {
    icon: FaDragon,
    fact: "H.P. Lovecraft creó los 'Mitos de Cthulhu' desde sus propias pesadillas, dando forma al terror cósmico: el miedo a lo incomprensible e infinito.",
  },
  {
    icon: FaMoon,
    fact: "Mary Shelley escribió 'Frankenstein' a los 18 años, en la famosa 'noche de tormentas' en la que Byron y Polidori se desafiaron a escribir relatos de miedo (1816).",
  },
  {
    icon: FaBookDead,
    fact: "Bram Stoker se inspiró para 'Drácula' en la figura histórica de Vlad el Empalador y en las leyendas de vampiros de los Balcanes.",
  },
  {
    icon: FaGhost,
    fact: "Horacio Quiroga, maestro del cuento rioplatense, escribió 'El almohadón de pluma', donde el horror habita en algo tan inofensivo como una almohada.",
  },
  {
    icon: FaQuestion,
    fact: "En la Edad Media se temía a los imagos negros como criaturas que compartían vínculos con las brujas.",
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
            className="group glass-card relative flex items-start gap-4 p-6 transition hover:border-amber-400/50"
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