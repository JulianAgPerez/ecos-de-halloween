import axios from "axios";
import { StoryDTO } from "../types";

export const url = import.meta.env.VITE_API_URL;

export const createStoryService = async (
  storyData: Omit<StoryDTO, "id">
): Promise<number> => {
  const response = await axios.post<StoryDTO>(`${url}/api/stories`, storyData);
  console.log("id: " + response.data.id);
  return response.data.id!;
};

export const uploadBodyService = async (
  file: File,
  storyId: number
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post<string>(
    `${url}/api/stories/upload-body/${storyId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("estoy en uploadBody: " + response.data);
  return response.data;
};

export const uploadStoryWithBody = async (
  title: string,
  description: string,
  backgroundImageUrl: string,
  file: File
): Promise<void> => {
  const storyData: Omit<StoryDTO, "id"> = {
    title,
    description,
    backgroundImageUrl,
    body: "",
  }; // body is initially empty
  try {
    const storyId = await createStoryService(storyData);
    console.log("estoy en upload story with body");
    await uploadBodyService(file, storyId);
  } catch (error) {
    console.error("Error al crear la historia o cargar el cuerpo", error);
    throw error;
  }
};
