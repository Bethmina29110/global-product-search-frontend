import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse, RagSearchData } from "./types";

export const ragApi = {
  search: async (query: string, signal?: AbortSignal): Promise<ApiResponse<RagSearchData>> => {
    console.log("ragApi.search making POST request to:", ENDPOINTS.RAG.SEARCH, "with query:", query);
    const response = await apiClient.post<ApiResponse<RagSearchData>>(
      ENDPOINTS.RAG.SEARCH,
      { query },
      { signal }
    );
    console.log("ragApi.search raw response object:", response);
    return response.data;
  },
};
