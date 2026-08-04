import { useEffect, useState } from "react";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useParams } from "react-router-dom";
import GhostLoader from "../components/GhostLoader";
import SpotifyPlayer from "../components/SpotifyPlayer";
import StoryReader from "../components/Story/StoryReader";
import { getFallbackStoryById, fallbackStories } from "../data/fallbackData";

const defaultBackgroundClass = "bg-home-principal";

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryDTO | null>(null);

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

  if (!story) {
    return <GhostLoader />;
  }

  const backgroundStyle = story.backgroundImageUrl
    ? { backgroundImage: `url(${story.backgroundImageUrl})` }
    : {};

  return (
    <div
      className={`w-full p-4 min-h-screen bg-cover bg-center ${
        story.backgroundImageUrl ? "" : defaultBackgroundClass
      }`}
      style={backgroundStyle}
    >
      <div className="mt-16 mb-16">
        <h1 className="font-creepster text-gray-500 text-6xl md:text-9xl font-bold text-center z-20 relative">
          {story.title}
        </h1>
      </div>
      <SpotifyPlayer />
      <StoryReader body={story.body} />
    </div>
  );
};
