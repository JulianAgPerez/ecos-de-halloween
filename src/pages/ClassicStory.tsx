import { useNavigate, useParams } from "react-router-dom";
import { ClassicStoryDTO, ClassicStoryTitleDTO } from "../types";
import { getClassicStoryById } from "../services/ClassicStoryService";
import { useClassicTitles } from "../hooks/useTitles";
import { useStoryReader } from "../hooks/useStoryReader";
import { saveLastRead } from "../utils/lastRead";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";

const fallbackClassic = async (slug: string): Promise<ClassicStoryDTO | null> => {
  const { getClassicStoryFallback } = await import(
    "../data/classicFallbackStories"
  );
  return getClassicStoryFallback(slug);
};

export const ClassicStory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { story, isFallback, previous, next, previousPath, nextPath } =
    useStoryReader<ClassicStoryDTO, ClassicStoryTitleDTO>({
      keyParam: slug,
      fetch: (key) => getClassicStoryById(key),
      fallback: fallbackClassic,
      useTitles: useClassicTitles,
      getTitleKey: (title) => title.slug,
      basePath: "/classic",
      save: (s) => {
        if (slug) {
          saveLastRead({ type: "classic", slug, title: s.title });
        }
      },
    });

  if (!story) {
    return <GhostLoader />;
  }

  return (
    <StoryPageLayout
      title={story.title}
      backgroundClass="bg-home-principal"
      meta={
        <>
          <p className="text-center text-gray-300 text-xl mt-2">
            {story.author}
            {story.year ? ` (${story.year})` : ""}
          </p>
          {story.translator && (
            <p className="text-center text-gray-400 italic text-sm mt-1">
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
          previousTitle={previous?.title}
          nextTitle={next?.title}
          onPrevious={previousPath ? () => navigate(previousPath) : undefined}
          onNext={nextPath ? () => navigate(nextPath) : undefined}
        />
      }
    />
  );
};

export default ClassicStory;