import { apiClient } from "./client";
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>("/auth/logout");
    return response.data;
  },
};
