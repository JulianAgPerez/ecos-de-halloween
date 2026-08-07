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
    console.error("Error fetching classic story", error);
    return null;
  }
};