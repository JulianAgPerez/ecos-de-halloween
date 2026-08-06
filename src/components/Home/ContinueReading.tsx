import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import { getLastRead, LastRead } from "../../utils/lastRead";

const ContinueReading: FC = () => {
  const navigate = useNavigate();
  const lastRead: LastRead | null = getLastRead();

  if (!lastRead) return null;

  const goTo = () => {
    if (lastRead.type === "classic" && lastRead.slug) {
      navigate(`/classic/${lastRead.slug}`);
    } else if (lastRead.type === "story" && lastRead.id !== undefined) {
      navigate(`/story/${lastRead.id}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <motion.button
        onClick={goTo}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group flex w-full items-center gap-5 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-purple-900/80 to-black/50 p-6 text-left shadow-2xl backdrop-blur-sm transition hover:border-amber-400/80"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
          <FaBookOpen size={24} />
        </span>
        <span className="flex-1">
          <span className="block text-sm uppercase tracking-widest text-amber-400">
            Continuar leyendo
          </span>
          <span className="mt-1 block text-xl font-bold text-white">
            {lastRead.title}
          </span>
        </span>
        <FaArrowRight className="hidden text-amber-400 transition-transform group-hover:translate-x-1 sm:block" />
      </motion.button>
    </div>
  );
};

export default ContinueReading;