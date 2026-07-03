import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse } from "./types";

export interface AnalyticsOverview {
  totalSearches: number;
  savedSearches: number;
  favoriteProducts: number;
  averageLatency: number;
}

export interface TopCategory {
  name: string;
  value: number;
}

export interface TopStore {
  name: string;
  value: number;
}

export interface PriceDistribution {
  range: string;
  count: number;
}

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await apiClient.get<ApiResponse<AnalyticsOverview>>(ENDPOINTS.ANALYTICS.OVERVIEW);
    return response.data.data;
  },

  getSearchTrend: async (): Promise<number[]> => {
    const response = await apiClient.get<ApiResponse<number[]>>(ENDPOINTS.ANALYTICS.SEARCH_TREND);
    return response.data.data;
  },

  getTopCategories: async (): Promise<TopCategory[]> => {
    const response = await apiClient.get<ApiResponse<TopCategory[]>>(ENDPOINTS.ANALYTICS.TOP_CATEGORIES);
    return response.data.data;
  },

  getTopStores: async (): Promise<TopStore[]> => {
    const response = await apiClient.get<ApiResponse<TopStore[]>>(ENDPOINTS.ANALYTICS.TOP_STORES);
    return response.data.data;
  },

  getPriceDistribution: async (): Promise<PriceDistribution[]> => {
    const response = await apiClient.get<ApiResponse<PriceDistribution[]>>(ENDPOINTS.ANALYTICS.PRICE_DISTRIBUTION);
    return response.data.data;
  },
};
