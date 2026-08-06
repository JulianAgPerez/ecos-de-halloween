import { useEffect, useState } from "react";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useNavigate, useParams } from "react-router-dom";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";
import useTitlesStore from "../store/useTitlesStore";
import { getFallbackStoryById, fallbackStories } from "../data/fallbackData";

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryDTO | null>(null);
  const storyTitles = useTitlesStore((s) => s.storyTitles);
  const fetchStoryTitles = useTitlesStore((s) => s.fetchStoryTitles);
  const navigate = useNavigate();
  const numericId = parseInt(id ?? "0", 10);

  useEffect(() => {
    if (!id) return;

    const timeout = setTimeout(() => {
      const fallback = getFallbackStoryById(parseInt(id)) ?? fallbackStories[0];
      setStory(fallback);
    }, 5000);

    const fetchStory = async () => {
      try {
        const storyData = await getStoryById(parseInt(id));
        clearTimeout(timeout);
        setStory(storyData);
      } catch {
        clearTimeout(timeout);
        const fallback =
          getFallbackStoryById(parseInt(id)) ?? fallbackStories[0];
        setStory(fallback);
      }
    };

    fetchStory();
    return () => clearTimeout(timeout);
  }, [id]);

  useEffect(() => {
    fetchStoryTitles();
  }, [fetchStoryTitles]);

  if (!story) {
    return <GhostLoader />;
  }

  const backgroundStyle = story.backgroundImageUrl
    ? { backgroundImage: `url(${story.backgroundImageUrl})` }
    : {};

  const sortedTitles = [...storyTitles].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
  const currentIndex = sortedTitles.findIndex((title) => title.id === numericId);
  const previousStory = currentIndex > 0 ? sortedTitles[currentIndex - 1] : null;
  const nextStory =
    currentIndex >= 0 && currentIndex < sortedTitles.length - 1
      ? sortedTitles[currentIndex + 1]
      : null;

  return (
    <StoryPageLayout
      title={story.title}
      backgroundStyle={backgroundStyle}
      body={story.body}
      footer={
        <ReadingNavigation
          onBack={() => navigate("/")}
          previousTitle={previousStory?.title}
          nextTitle={nextStory?.title}
          onPrevious={() => previousStory && navigate(`/story/${previousStory.id}`)}
          onNext={() => nextStory && navigate(`/story/${nextStory.id}`)}
        />
      }
    />
  );
};

export default Story;
