import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { SavedSearch, SaveSearchDto, PaginatedResult } from "./types";

export const savedSearchesApi = {
  getSavedSearches: async (page: number = 1, limit: number = 20): Promise<PaginatedResult<SavedSearch> | SavedSearch[]> => {
    const response = await apiClient.get<any>(ENDPOINTS.SAVED_SEARCH.BASE, { params: { page, limit } });
    const body = response.data;
    const actualData = body?.success !== undefined && body?.data !== undefined ? body.data : body;

    // Check if the flattened meta contains pagination info from NestJS interceptor
    if (body?.meta && body.meta.totalPages !== undefined && Array.isArray(actualData)) {
      return {
        data: actualData,
        meta: body.meta as any
      };
    }
    
    if (Array.isArray(actualData)) return actualData;
    return actualData || [];
  },

  saveSearch: async (data: SaveSearchDto): Promise<SavedSearch> => {
    const response = await apiClient.post<any>(ENDPOINTS.SAVED_SEARCH.BASE, data);
    const body = response.data;
    if (body && body.data) return body.data;
    return body;
  },

  deleteSavedSearch: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.SAVED_SEARCH.BY_ID(id));
  },
};
