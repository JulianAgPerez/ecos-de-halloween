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
    text: "Ningún organismo vivo puede mantenerse cuerdo durante mucho tiempo en condiciones de realidad absoluta.",
    author: "Shirley Jackson, «La maldición de Hill House»",
  },
  {
    text: "¡Es verdad! Es cierto que soy muy nervioso, espantosamente nervioso, ¿pero por qué dicen que estoy loco?",
    author: "Edgar Allan Poe, «El corazón delator»",
  },
  {
    text: "Los fantasmas son reales. Y no siempre vienen los que uno llama.",
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
    text: "Incluso de los horrores más grandes, la ironía rara vez está ausente.",
    author: "H. P. Lovecraft, «La sombra sobre Innsmouth»",
  },
  {
    text: "Y sus ojos tienen toda la apariencia de los de un demonio que está soñando.",
    author: "Edgar Allan Poe, «El cuervo»",
  },
  {
    text: "No hay naturaleza en las cosas. No hay rostros, solo máscaras tensadas contra el caos que se agita detrás de ellas.",
    author: "Thomas Ligotti, «Noctuario»",
  },
  {
    text: "La cosa más misericordiosa del mundo, creo, es la incapacidad de la mente humana para correlacionar todos sus contenidos.",
    author: "H. P. Lovecraft, «La llamada de Cthulhu»",
  },
  {
    text: "¡Bienvenidos a mi casa! Entren libremente y por su propia voluntad.",
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
