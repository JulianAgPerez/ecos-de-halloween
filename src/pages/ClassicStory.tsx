import { useEffect, useState } from "react";
import { ClassicStoryDTO, ClassicStoryTitleDTO } from "../types";
import {
  getClassicStoryById,
  getAllClassicTitles,
} from "../services/ClassicStoryService";
import { useNavigate, useParams } from "react-router-dom";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";
import {
  getClassicStoryFallback,
  classicFallbackTitles,
} from "../data/classicFallback";

export const ClassicStory = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<ClassicStoryDTO | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [titles, setTitles] = useState<ClassicStoryTitleDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const timeout = setTimeout(() => {
      const fallback = getClassicStoryFallback(slug);
      if (fallback) {
        setStory(fallback);
        setIsFallback(true);
      }
    }, 5000);

    const fetchStory = async () => {
      try {
        const storyData = await getClassicStoryById(slug);
        clearTimeout(timeout);
        if (storyData) {
          setStory(storyData);
        } else {
          const fallback = getClassicStoryFallback(slug);
          if (fallback) {
            setStory(fallback);
            setIsFallback(true);
          }
        }
      } catch {
        clearTimeout(timeout);
        const fallback = getClassicStoryFallback(slug);
        if (fallback) {
          setStory(fallback);
          setIsFallback(true);
        }
      }
    };

    fetchStory();
    return () => clearTimeout(timeout);
  }, [slug]);

  useEffect(() => {
    let mounted = true;

    const loadTitles = async () => {
      try {
        const names = await getAllClassicTitles();
        if (mounted) {
          setTitles(
            Array.isArray(names) && names.length > 0 ? names : classicFallbackTitles,
          );
        }
      } catch {
        if (mounted) setTitles(classicFallbackTitles);
      }
    };

    loadTitles();
    return () => {
      mounted = false;
    };
  }, []);

  if (!story) {
    return <GhostLoader />;
  }

  const sortedTitles = [...titles].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
  const currentIndex = sortedTitles.findIndex((title) => title.slug === slug);
  const previousClassic = currentIndex > 0 ? sortedTitles[currentIndex - 1] : null;
  const nextClassic =
    currentIndex >= 0 && currentIndex < sortedTitles.length - 1
      ? sortedTitles[currentIndex + 1]
      : null;

  return (
    <StoryPageLayout
      title={story.title}
      backgroundClass="bg-home-principal"
      meta={
        <>
          <p className="text-center text-gray-400 text-xl mt-2">
            {story.author}
            {story.year ? ` (${story.year})` : ""}
          </p>
          {story.translator && (
            <p className="text-center text-gray-500 italic text-sm mt-1">
              Traducción de {story.translator}
            </p>
          )}
          {isFallback && (
            <p className="text-yellow-500 text-xs text-center mt-2">
              ⚠️ Clásico sin conexión
            </p>
          )}
          <div className="flex justify-center mt-4">
            {story.license === "cc-by-sa-4.0" ? (
              <a
                href={story.licenseUrl ?? story.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700"
              >
                CC BY-SA 4.0
              </a>
            ) : (
              <a
                href={story.licenseUrl ?? story.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full hover:bg-gray-700"
              >
                Dominio Público
              </a>
            )}
          </div>
          {story.sourceUrl && (
            <p className="text-center mt-2">
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline text-xs"
              >
                Fuente: Wikisource
              </a>
            </p>
          )}
        </>
      }
      body={story.body}
      footer={
        <ReadingNavigation
          onBack={() => navigate("/")}
          entityLabel="clásico"
          previousTitle={previousClassic?.title}
          nextTitle={nextClassic?.title}
          onPrevious={() => previousClassic && navigate(`/classic/${previousClassic.slug}`)}
          onNext={() => nextClassic && navigate(`/classic/${nextClassic.slug}`)}
        />
      }
    />
  );
};

export default ClassicStory;
