import { apiClient } from "./client";
import { SearchParams, SearchResponse } from "./types";

export const searchApi = {
  searchProducts: async (params: SearchParams): Promise<SearchResponse> => {
    // Normal or semantic search endpoint (based on what's configured on backend)
    const response = await apiClient.post<SearchResponse>("/search", params);
    return response.data;
  },

  ragSearch: async (params: SearchParams): Promise<SearchResponse> => {
    // RAG-specific endpoint
    const response = await apiClient.post<SearchResponse>("/rag", params);
    return response.data;
  },
};
