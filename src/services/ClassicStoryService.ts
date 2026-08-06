import axios from "axios";
import { ClassicStoryDTO, ClassicStoryTitleDTO } from "../types";

export const url = import.meta.env.VITE_API_URL;

export const getAllClassicTitles = async (): Promise<ClassicStoryTitleDTO[]> => {
  const response = await axios.get<ClassicStoryTitleDTO[]>(url + "/api/classics");
  return response.data;
};

export const getClassicStoryById = async (
  slug: string,
): Promise<ClassicStoryDTO | null> => {
  try {
    const response = await axios.get<ClassicStoryDTO>(
      url + `/api/classics/${encodeURIComponent(slug)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching classic story", error);
    return null;
  }
};
