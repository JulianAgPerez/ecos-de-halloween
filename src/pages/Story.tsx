import { useEffect, useRef, useState } from "react";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useParams } from "react-router-dom";
import GhostLoader from "../components/GhostLoader";
import SpotifyPlayer from "../components/SpotifyPlayer";
import ScrollingCircle from "../components/Story/ScrollingCircle";
import { getFallbackStoryById, fallbackStories } from "../data/fallbackData";

const defaultBackgroundClass = "bg-home-principal";

export const Story = () => {
  const ref = useRef(null);
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
      } catch (error) {
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
      <section>
        <div className="note-background mt-2 font-bold text-2xl content-center text-left">
          <ScrollingCircle refProp={ref} />
          <pre ref={ref}>{story.body}</pre>
        </div>
      </section>
    </div>
  );
};
