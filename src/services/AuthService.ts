import { api } from "./api";

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

interface RawAuthResponse {
  access_token: string;
  refresh_token: string;
}

export const registerUser = async (
  registerData: RegisterData,
): Promise<AuthResponse> => {
  const response = await api.post<RawAuthResponse>(
    "/auth/register",
    registerData,
    { withCredentials: true },
  );
  return {
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  const response = await api.post<RawAuthResponse>("/auth/login", loginData, {
    withCredentials: true,
  });
  return {
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};