import { useEffect, useState } from "react";
import { StoryDTO } from "../types";
import { getStoryById } from "../services/StoryService";
import { useParams } from "react-router-dom";

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
  return (
    <div>
      <h1>{story.title}</h1>
      <p>{story.body}</p>
    </div>
  );
};
