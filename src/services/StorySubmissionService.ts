import { StoryDTO } from "../types";
import useAuthStore from "../store/useAuthStore";
import { api } from "./api";

const getAuthHeaders = (): Record<string, string> => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface SubmitStoryPayload {
  title: string;
  body: string;
  description?: string;
  author?: string;
}

// Un solo POST: el cuerpo viaja inline como HTML.
export const submitStory = async (
  payload: SubmitStoryPayload,
): Promise<StoryDTO> => {
  const response = await api.post<StoryDTO>("/api/stories", payload, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};
