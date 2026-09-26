import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import { getLastRead } from "../../utils/lastRead";
import { lastReadRoute } from "../../utils/lastReadRoute";

const MotionLink = motion.create(Link);

const ContinueReading: FC = () => {
  const lastRead = getLastRead();
  const route = lastRead ? lastReadRoute(lastRead) : null;

  if (!lastRead || !route) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16">
      <MotionLink
        to={route}
        whileHover={{ scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-purple-900/80 to-black/50 p-6 text-left shadow-2xl backdrop-blur-sm transition hover:border-amber-400/80"
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
      </MotionLink>
    </div>
  );
};

export default ContinueReading;