import { useEffect, useState } from "react";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useParams } from "react-router-dom";

const defaultBackgroundClass = "bg-home-principal";

export const Story = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryDTO | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (id) {
        const storyData = await getStoryById(parseInt(id));
        setStory(storyData);
      }
    };

    fetchStory();
  }, [id]);

  if (!story) {
    return <div>Cargando...</div>;
  }

  const backgroundStyle = story.backgroundImageUrl
    ? { backgroundImage: `url(${story.backgroundImageUrl})` }
    : {};

  return (
    <div
      className={`container mx-auto p-4 h-screen bg-cover bg-center ${
        story.backgroundImageUrl ? "" : defaultBackgroundClass
      }`}
      style={backgroundStyle}
    >
      <h1 className="font-creepster text-gray-500 text-6xl md:text-9xl font-bold text-center z-20 relative">
        {story.title}
      </h1>
      <p>{story.body}</p>
    </div>
  );
};
