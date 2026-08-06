import { FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    text: "El miedo más antiguo y más fuerte es el miedo a lo desconocido.",
    author: "H. P. Lovecraft",
  },
  {
    text: "¡Es verdad! Soy muy nervioso, espantosamente nervioso.",
    author: "Edgar Allan Poe, «El corazón delator»",
  },
  {
    text: "En su morada de R'lyeh, el cuervo Cthulhu aguarda soñando.",
    author: "H. P. Lovecraft, invocación cthulhiana",
  },
  {
    text: "En ese extraño nido de amor, Alicia pasó todo el otoño.",
    author: "Horacio Quiroga, «El almohadón de pluma»",
  },
];

const ROTATION_MS = 8000;

const TerrorQuote: FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % QUOTES.length),
      ROTATION_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const quote = QUOTES[index];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xl italic leading-relaxed text-gray-300 md:text-2xl">
            “{quote.text}”
          </p>
          <footer className="mt-4 text-sm uppercase tracking-widest text-amber-400">
            — {quote.author}
          </footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
};

export default TerrorQuote;