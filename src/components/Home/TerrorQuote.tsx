import { FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    text: "El miedo es el don del que nadie quiere hablar. Es el silencio que te sigue cuando estás solo.",
    author: "La bruja del bosque",
  },
  {
    text: "En la oscuridad, cada sombra esconde una historia que prefiere no ser contada.",
    author: "El cuervo",
  },
  {
    text: "No tengas miedo de lo que ves en la noche; ten miedo de lo que la noche ve en ti.",
    author: "La luna llena",
  },
  {
    text: "Los ecos que escuchas no vienen del bosque. Vienen de lo que dejaste enterrado.",
    author: "El guardián de la cripta",
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