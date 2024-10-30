import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const registerUser = async (registerData: any) => {
  const response = await axios.post(`${API_URL}/register`, registerData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

export const loginUser = async (loginData: any) => {
  const response = await axios.post(`${API_URL}/login`, loginData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
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
