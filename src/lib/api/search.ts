import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse, SearchResultData } from "./types";

export const searchApi = {
  search: async (query: string, signal?: AbortSignal): Promise<ApiResponse<SearchResultData>> => {
    console.log("searchApi.search making GET request to:", ENDPOINTS.SEARCH.NORMAL, "with query:", query);
    const response = await apiClient.get<ApiResponse<SearchResultData>>(ENDPOINTS.SEARCH.NORMAL, {
      params: { q: query },
      signal,
    });
    console.log("searchApi.search raw response object:", response);
    return response.data;
  },
};
