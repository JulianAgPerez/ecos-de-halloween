import { useEffect, useState } from "react";
import { ClassicStoryDTO } from "../types";
import { getClassicStoryById } from "../services/ClassicStoryService";
import { useParams } from "react-router-dom";
import GhostLoader from "../components/GhostLoader";
import SpotifyPlayer from "../components/SpotifyPlayer";
import StoryReader from "../components/Story/StoryReader";
import { getClassicStoryFallback } from "../data/classicFallback";

const defaultBackgroundClass = "bg-home-principal";

export const ClassicStory = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<ClassicStoryDTO | null>(null);
  const [isFallback, setIsFallback] = useState(false);

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

  if (!story) {
    return <GhostLoader />;
  }

  return (
    <div className={`w-full p-4 min-h-screen ${defaultBackgroundClass}`}>
      <div className="mt-16 mb-8">
        <h1 className="font-creepster text-gray-500 text-6xl md:text-9xl font-bold text-center z-20 relative">
          {story.title}
        </h1>
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
      </div>
      <SpotifyPlayer />
      {story.body && <StoryReader body={story.body} />}
    </div>
  );
};

export default ClassicStory;
