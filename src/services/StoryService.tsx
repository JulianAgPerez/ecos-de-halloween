import axios from "axios";
import { StoryDTO, StoryTitleDTO } from "../types";

export const url = import.meta.env.VITE_API_URL;

export const getAllStoryTitles = async (): Promise<StoryTitleDTO[]> => {
  try {
    const response = await axios.get<StoryTitleDTO[]>(
      url + "/api/stories/all-titles",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching story titles", error);
    return [];
  }
};

export const getStoryById = async (id: number): Promise<StoryDTO | null> => {
  try {
    const response = await axios.get<StoryDTO>(url + `/api/stories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching story id", error);
    return null;
  }
};
