import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import {
  FaBookDead,
  FaGhost,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";
import useTitlesStore from "../../store/useTitlesStore";
import { getStoryById } from "../../services/StoryService";
import { StoryDTO } from "../../types";

const FEATURED_AMOUNT = 3;

const SectionHeading: FC<{ icon: IconType; title: string }> = ({
  icon: Icon,
  title,
}) => (
  <h3 className="mb-6 flex items-center justify-center gap-3 font-creepster text-3xl md:text-4xl text-amber-400">
    <Icon className="text-purple-400" />
    {title}
  </h3>
);

const StoryCatalog = () => {
  const navigate = useNavigate();
  const storyTitles = useTitlesStore((s) => s.storyTitles);
  const classicTitles = useTitlesStore((s) => s.classicTitles);

  const [featured, setFeatured] = useState<StoryDTO[]>([]);

  useEffect(() => {
    let active = true;
    const ids = storyTitles.slice(0, FEATURED_AMOUNT).map((s) => s.id);
    if (ids.length === 0) return;
    Promise.all(ids.map((id) => getStoryById(id))).then((results) => {
      if (!active) return;
      setFeatured(results.filter((s): s is StoryDTO => s !== null));
    });
    return () => {
      active = false;
    };
  }, [storyTitles]);

  const visibleClassics = classicTitles.slice(0, FEATURED_AMOUNT);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16">
      <SectionHeading icon={FaGhost} title="Historias destacadas" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((story, i) => (
          <motion.button
            key={story.id}
            onClick={() => story.id && navigate(`/story/${story.id}`)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col rounded-2xl border border-purple-800/50 bg-black/30 p-6 text-left shadow-lg backdrop-blur-sm transition hover:border-amber-400/60"
          >
            <FaGhost className="mb-3 text-2xl text-purple-400" />
            <h4 className="text-xl font-bold text-white group-hover:text-amber-300">
              {story.title}
            </h4>
            {story.description && (
              <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-3">
                {story.description}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400">
              Leer historia{" "}
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        ))}
      </div>

      {visibleClassics.length > 0 && (
        <>
          <div className="my-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-purple-800/50" />
            <FaBookOpen className="text-purple-500" />
            <div className="h-px flex-1 bg-purple-800/50" />
          </div>
          <SectionHeading icon={FaBookDead} title="Clásicos del Terror" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleClassics.map((classic, i) => (
              <motion.button
                key={classic.slug}
                onClick={() => navigate(`/classic/${classic.slug}`)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col rounded-2xl border border-purple-800/60 bg-black/30 p-6 text-left shadow-lg backdrop-blur-sm transition hover:border-amber-400/60"
              >
                <FaBookDead className="mb-3 text-2xl text-purple-400" />
                <h4 className="text-xl font-bold text-white group-hover:text-amber-300">
                  {classic.title}
                </h4>
                <span className="mt-2 flex-1 text-sm italic text-gray-400">
                  {classic.author}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400">
                  Leer clásico{" "}
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StoryCatalog;