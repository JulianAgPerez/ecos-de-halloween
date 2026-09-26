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
    // Un 404 significa que la historia no existe, así que se devuelve null y la
    // vista puede mostrar el 404. Cualquier otro error es un fallo real: tiene
    // que llegar al llamador para que pruebe con la copia local.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching story id", error);
    throw error;
  }
};
