import { FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    text: "La emoción más antigua y más intensa de la humanidad es el miedo, y el más antiguo y más intenso de los miedos es el miedo a lo desconocido.",
    author: "H. P. Lovecraft, «El horror sobrenatural en la literatura»",
  },
  {
    text: "Ningún organismo vivo puede mantenerse cuerdo durante mucho tiempo en condiciones de reality absoluta.",
    author: "Shirley Jackson, «La maldición de Hill House»",
  },
  {
    text: "¡Es verdad! Es cierto que soy muy nervioso, espantosamente nervioso, ¿pero por qué dicen que estoy loco?",
    author: "Edgar Allan Poe, «El corazón delator»",
  },
  {
    text: "El pozo es el final de todo. La última parada antes de que el mundo se convierta en nada.",
    author: "Mariana Enríquez, «Nuestra parte de noche»",
  },
  {
    text: "No está muerto lo que puede yacer eternamente, y con el paso de los extraños eones, incluso la muerte puede morir.",
    author: "H. P. Lovecraft, «La ciudad sin nombre»",
  },
  {
    text: "Los monstruos son reales, y los fantasmas también: viven dentro de nosotros y, a veces, ellos ganan.",
    author: "Stephen King",
  },
  {
    text: "En ese extraño nido de amor, Alicia pasó todo el otoño.",
    author: "Horacio Quiroga, «El almohadón de plumas»",
  },
  {
    text: "No miré hacia arriba, aunque sabía que las estrellas se balanceaban en un baile de burla abominable.",
    author: "H. P. Lovecraft, «Las ratas en las paredes»",
  },
  {
    text: "Y mis ojos tienen toda la apariencia de los de un demonio que está soñando.",
    author: "Edgar Allan Poe, «El cuervo»",
  },
  {
    text: "No es la altura, no es la profundidad. Es la absoluta falta de suelo bajo nuestros pies.",
    author: "Thomas Ligotti, «Noctuario»",
  },
  {
    text: "La cosa más misericordiosa del mundo, creo, es la incapacidad de la mente humana para correlacionar todos sus contenidos.",
    author: "H. P. Lovecraft, «La llamada de Cthulhu»",
  },
  {
    text: "Bienvenidos a mi casa. Entren libremente, salgan sin temor, y dejen algo de la felicidad que traen.",
    author: "Bram Stoker, «Drácula»",
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
