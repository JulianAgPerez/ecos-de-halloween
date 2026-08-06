import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { fallbackStories, getFallbackStoryById } from "../data/fallbackData";
import { useStoryTitles } from "../hooks/useTitles";
import { useStoryFetch } from "../hooks/useStoryFetch";
import { findAdjacent } from "../utils/adjacent";
import { saveLastRead } from "../utils/lastRead";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? "0", 10);
  const navigate = useNavigate();
  const { titles: storyTitles } = useStoryTitles();

  const { story } = useStoryFetch<StoryDTO, number>({
    key: numericId,
    fetch: getStoryById,
    fallback: (storyId) => getFallbackStoryById(storyId) ?? fallbackStories[0],
    saveLastRead: (s) =>
      saveLastRead({ type: "story", id: numericId, title: s.title }),
  });

  const { previous, next } = useMemo(
    () => findAdjacent(storyTitles, numericId, (title) => title.id),
    [storyTitles, numericId],
  );

  if (!story) {
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
          onPrevious={() => previous && navigate(`/story/${previous.id}`)}
          onNext={() => next && navigate(`/story/${next.id}`)}
        />
      }
    />
  );
};

export default Story;
