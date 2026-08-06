import { useEffect, useState } from "react";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useNavigate, useParams } from "react-router-dom";
import GhostLoader from "../components/GhostLoader";
import StoryPageLayout from "../components/Story/StoryPageLayout";
import ReadingNavigation from "../components/Story/ReadingNavigation";
import useTitlesStore from "../store/useTitlesStore";
import { saveLastRead } from "../utils/lastRead";
import { getFallbackStoryById, fallbackStories } from "../data/fallbackData";
import { getOptimizedBackgroundUrl } from "../utils/cloudinary";

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryDTO | null>(null);
  const [bgReady, setBgReady] = useState(false);
  const storyTitles = useTitlesStore((s) => s.storyTitles);
  const fetchStoryTitles = useTitlesStore((s) => s.fetchStoryTitles);
  const navigate = useNavigate();
  const numericId = parseInt(id ?? "0", 10);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    setStory(null);
    setBgReady(false);
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

  useEffect(() => {
    if (story) {
      saveLastRead({ type: "story", id: numericId, title: story.title });
    }
  }, [story, numericId]);

  useEffect(() => {
    fetchStoryTitles();
  }, [fetchStoryTitles]);

  if (!story || !bgReady) {
    return <GhostLoader />;
  }

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
      backgroundImageUrl={story.backgroundImageUrl}
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
