import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
