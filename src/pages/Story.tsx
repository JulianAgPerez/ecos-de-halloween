import { lazy, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoryDTO, StoryTitleDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useStoryTitles } from "../hooks/useTitles";
import { useStoryReader } from "../hooks/useStoryReader";
import { useSeo } from "../hooks/useSeo";
import { saveLastRead } from "../utils/lastRead";
import { getOptimizedBackgroundUrl } from "../utils/cloudinary";
import { userStoryJsonLd } from "../utils/seo";
import { SITE_DESCRIPTION } from "../config";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";

const NotFound = lazy(() => import("../pages/NotFound"));

const fallbackStory = async (key: string): Promise<StoryDTO | null> => {
  const { getFallbackStoryById } = await import("../data/fallbackData");
  const id = parseInt(key, 10);
  // Sin copia local para este id no hay nada que inventar: se devuelve null y la
  // vista cae en el 404 en vez de mostrar otra historia.
  return getFallbackStoryById(id) ?? null;
};

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? "0", 10);
  const navigate = useNavigate();
  const [bgReady, setBgReady] = useState(false);

  const { story, previous, next, previousPath, nextPath, isPending } =
    useStoryReader<StoryDTO, StoryTitleDTO>({
      keyParam: id,
      fetch: (key) => getStoryById(parseInt(key, 10)),
      fallback: fallbackStory,
      useTitles: useStoryTitles,
      getTitleKey: (title) => String(title.id),
      basePath: "/story",
      save: (s) => saveLastRead({ type: "story", id: numericId, title: s.title }),
    });

  const path = `/story/${id ?? ""}`;

  useSeo({
    title: story?.title ?? (isPending ? "Cargando" : "Página no encontrada"),
    description: story?.description ?? SITE_DESCRIPTION,
    canonicalPath: story ? path : undefined,
    jsonLd: story ? userStoryJsonLd(story, path) : undefined,
    // El useSeo del padre corre después del de NotFound, así que el 404 real
    // depende de esta flag y no de la del hijo.
    noindex: !story,
  });

  useEffect(() => {
    setBgReady(false);
  }, [id]);

  useEffect(() => {
    if (!story?.backgroundImageUrl) {
      setBgReady(true);
      return;
    }

    const img = new Image();
    img.onload = () => setBgReady(true);
    img.onerror = () => setBgReady(true);
    img.src = getOptimizedBackgroundUrl(story.backgroundImageUrl);

    const failsafe = setTimeout(() => setBgReady(true), 8000);

    return () => {
      img.onload = null;
      img.onerror = null;
      clearTimeout(failsafe);
    };
  }, [story]);

  if (isPending) {
    return <GhostLoader />;
  }

  if (!story) {
    return <NotFound />;
  }

  if (!bgReady) {
    return <GhostLoader />;
  }

  return (
    <StoryPageLayout
      title={story.title}
      backgroundImageUrl={story.backgroundImageUrl}
      body={story.body}
      footer={
        <ReadingNavigation
          onBack={() => navigate("/")}
          previousTitle={previous?.title}
          nextTitle={next?.title}
          onPrevious={previousPath ? () => navigate(previousPath) : undefined}
          onNext={nextPath ? () => navigate(nextPath) : undefined}
        />
      }
    />
  );
};

export default Story;
