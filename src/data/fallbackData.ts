import { StoryDTO } from "../types";
import stories from "./fallbackStories.json";

export const fallbackStories: StoryDTO[] = stories;

export const getFallbackStoryById = (id: number): StoryDTO | undefined => {
  return fallbackStories.find((story) => story.id === id);
};
