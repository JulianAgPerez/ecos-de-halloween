import axios from "axios";
import { ClassicStoryDTO, ClassicStoryTitleDTO } from "../types";
import { api } from "./api";

export const getAllClassicTitles = async (): Promise<ClassicStoryTitleDTO[]> => {
  const response = await api.get<ClassicStoryTitleDTO[]>("/api/classics");
  return response.data;
};

export const getClassicStoryById = async (
  slug: string,
): Promise<ClassicStoryDTO | null> => {
  try {
    const response = await api.get<ClassicStoryDTO>(
      `/api/classics/${encodeURIComponent(slug)}`,
    );
    return response.data;
  } catch (error) {
    // Un 404 significa que el clásico no existe, así que se devuelve null y la
    // vista puede mostrar el 404. Cualquier otro error es un fallo real: tiene
    // que llegar al llamador para que pruebe con la copia local.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching classic story", error);
    throw error;
  }
};
