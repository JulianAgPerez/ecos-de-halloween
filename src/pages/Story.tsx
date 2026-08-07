import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoryDTO, StoryTitleDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useStoryTitles } from "../hooks/useTitles";
import { useStoryReader } from "../hooks/useStoryReader";
import { saveLastRead } from "../utils/lastRead";
import { getOptimizedBackgroundUrl } from "../utils/cloudinary";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";

const fallbackStory = async (key: string): Promise<StoryDTO | null> => {
  const { fallbackStories, getFallbackStoryById } = await import(
    "../data/fallbackData"
  );
  const id = parseInt(key, 10);
  return getFallbackStoryById(id) ?? fallbackStories[0] ?? null;
};

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? "0", 10);
  const navigate = useNavigate();
  const [bgReady, setBgReady] = useState(false);

  const { story, previous, next, previousPath, nextPath } =
    useStoryReader<StoryDTO, StoryTitleDTO>({
      keyParam: id,
      fetch: (key) => getStoryById(parseInt(key, 10)),
      fallback: fallbackStory,
      useTitles: useStoryTitles,
      getTitleKey: (title) => String(title.id),
      basePath: "/story",
      save: (s) => saveLastRead({ type: "story", id: numericId, title: s.title }),
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

  if (!story || !bgReady) {
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