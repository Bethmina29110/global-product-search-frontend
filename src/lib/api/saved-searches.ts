import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { SavedSearch, SaveSearchDto, ApiResponse } from "./types";

export const savedSearchesApi = {
  getSavedSearches: async (): Promise<SavedSearch[]> => {
    const response = await apiClient.get<any>(ENDPOINTS.SAVED_SEARCH.BASE);
    const body = response.data;
    if (body && Array.isArray(body)) return body;
    if (body && body.data && Array.isArray(body.data)) return body.data;
    return [];
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
