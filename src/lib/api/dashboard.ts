import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { SavedSearch, ApiResponse } from "./types";

export interface DashboardOverview {
  totalSearches: number;
  savedIntentQueries: number;
  favoriteProducts: number;
  averageLatency: number;
}

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get<ApiResponse<DashboardOverview>>(ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data.data;
  },

  getRecentSavedQueries: async (): Promise<SavedSearch[]> => {
    const response = await apiClient.get<ApiResponse<SavedSearch[]>>(ENDPOINTS.DASHBOARD.RECENT_QUERIES);
    return response.data.data;
  },

  getSemanticSearchActivity: async (): Promise<number[]> => {
    const response = await apiClient.get<ApiResponse<number[]>>(ENDPOINTS.DASHBOARD.SEMANTIC_ACTIVITY);
    return response.data.data;
  },
};
