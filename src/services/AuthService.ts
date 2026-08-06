import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
}

export const registerUser = async (
  registerData: RegisterData,
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, registerData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return {
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, loginData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return {
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

export const refreshToken = async (token: string) => {
  const response = await axios.post(
    `${API_URL}/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};
