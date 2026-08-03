import axios from "axios";
import { ClassicStoryTitleDTO } from "../types";
import { classicFallbackTitles } from "../data/classicFallback";

export const url = import.meta.env.VITE_API_URL;

export const getAllClassicTitles = async (): Promise<ClassicStoryTitleDTO[]> => {
  try {
    const response = await axios.get<ClassicStoryTitleDTO[]>(
      url + "/api/classics/all-titles",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching classic story titles", error);
    return classicFallbackTitles;
  }
};
