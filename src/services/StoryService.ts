import axios from "axios";
import { StoryDTO, StoryTitleDTO } from "../types";
import { api } from "./api";

export const getAllStoryTitles = async (): Promise<StoryTitleDTO[]> => {
  const response = await api.get<StoryTitleDTO[]>("/api/stories/all-titles");
  return response.data;
};

export const getStoryById = async (id: number): Promise<StoryDTO | null> => {
  try {
    const response = await api.get<StoryDTO>(`/api/stories/${id}`);
    return response.data;
  } catch (error) {
    // null = no existe; cualquier otro error se propaga para el respaldo local.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching story id", error);
    throw error;
  }
};
