import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookDead, FaGhost, FaArrowRight, FaBookOpen } from "react-icons/fa";
import { useClassicTitles, useStoryTitles } from "../../hooks/useTitles";
import { getStoryById } from "../../services/StoryService";
import { ClassicStoryTitleDTO, StoryDTO } from "../../types";
import SectionHeading from "./SectionHeading";

const FEATURED_AMOUNT = 3;

const PREFERRED_OTHER_AUTHORS = [
  "Horacio Quiroga",
  "Gustavo Adolfo Bécquer",
  "Mary Shelley",
  "Bram Stoker",
];

const pickFeaturedClassics = (
  titles: ClassicStoryTitleDTO[],
): ClassicStoryTitleDTO[] => {
  const picks: ClassicStoryTitleDTO[] = [];
  const usedAuthors = new Set<string>();

  const take = (predicate: (t: ClassicStoryTitleDTO) => boolean): void => {
    const found = titles.find(
      (t) => predicate(t) && !usedAuthors.has(t.author),
    );
    if (found) {
      picks.push(found);
      usedAuthors.add(found.author);
    }
  };

  take((t) => /lovecraft/i.test(t.author));
  take((t) => /poe/i.test(t.author));
  for (const author of PREFERRED_OTHER_AUTHORS) {
    take((t) => t.author.includes(author));
  }
  for (const t of titles) {
    if (picks.length >= FEATURED_AMOUNT) break;
    if (usedAuthors.has(t.author)) continue;
    picks.push(t);
    usedAuthors.add(t.author);
  }
  return picks.slice(0, FEATURED_AMOUNT);
};

const StoryCatalog = () => {
  const navigate = useNavigate();
  const { titles: storyTitles } = useStoryTitles();
  const { titles: classicTitles } = useClassicTitles();

  const [featured, setFeatured] = useState<StoryDTO[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const ids = storyTitles.slice(0, FEATURED_AMOUNT).map((s) => s.id);
    if (ids.length === 0) {
      setFeaturedLoading(false);
      return;
    }
    setFeaturedLoading(true);
    Promise.all(ids.map((id) => getStoryById(id).catch(() => null))).then(
      (results) => {
        if (!active) return;
        setFeatured(results.filter((s): s is StoryDTO => s !== null));
        setFeaturedLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [storyTitles]);

  const visibleClassics = pickFeaturedClassics(classicTitles);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16">
      <SectionHeading icon={FaGhost}>Historias destacadas</SectionHeading>

      {featuredLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card flex flex-col p-6 animate-pulse">
              <div className="mb-3 h-8 w-8 rounded-full bg-purple-700/40" />
              <div className="h-6 w-3/4 rounded bg-purple-700/40" />
              <div className="mt-3 h-4 w-full rounded bg-purple-900/40" />
              <div className="mt-2 h-4 w-2/3 rounded bg-purple-900/40" />
            </div>
          ))}
        </div>
      ) : (
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
              className="group glass-card flex flex-col p-6 text-left shadow-lg transition hover:border-amber-400/60"
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
      )}

      {visibleClassics.length > 0 && (
        <>
          <div className="my-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-purple-800/50" />
            <FaBookOpen className="text-purple-500" />
            <div className="h-px flex-1 bg-purple-800/50" />
          </div>
          <SectionHeading icon={FaBookDead}>Clásicos del Terror</SectionHeading>
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
                className="group glass-card flex flex-col p-6 text-left shadow-lg transition hover:border-amber-400/60"
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
