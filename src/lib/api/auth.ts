import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { LoginCredentials, RegisterCredentials, ApiResponse, AuthData, User } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthData>> => {
    console.log("authApi.login making API request to:", ENDPOINTS.AUTH.LOGIN, "with payload:", credentials);
    const response = await apiClient.post<ApiResponse<AuthData>>(ENDPOINTS.AUTH.LOGIN, credentials);
    console.log("authApi.login raw response object:", response);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthData>> => {
    const response = await apiClient.post<ApiResponse<AuthData>>(ENDPOINTS.AUTH.REGISTER, credentials);
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

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(ENDPOINTS.AUTH.ME, data);
    return response.data;
  },

  changePassword: async (data: { currentPassword?: string; newPassword?: string }): Promise<void> => {
    await apiClient.post(`${ENDPOINTS.AUTH.ME}/change-password`, data);
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete(ENDPOINTS.AUTH.ME);
  },

  clearSearchHistory: async (): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.AUTH.ME}/search-history`);
  },

  clearFavourites: async (): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.AUTH.ME}/favourites`);
  },

  clearSavedSearches: async (): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.AUTH.ME}/saved-searches`);
  },
};
