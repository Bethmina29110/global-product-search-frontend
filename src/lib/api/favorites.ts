import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { Favourite, SaveFavouriteDto, PaginatedResult } from "./types";

export const favoritesApi = {
  getFavorites: async (page: number = 1, limit: number = 20): Promise<PaginatedResult<Favourite> | Favourite[]> => {
    const response = await apiClient.get<any>(ENDPOINTS.FAVOURITES.BASE, { params: { page, limit } });
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

  saveFavorite: async (data: SaveFavouriteDto): Promise<Favourite> => {
    const response = await apiClient.post<Favourite>(ENDPOINTS.FAVOURITES.BASE, data);
    return response.data;
  },

  removeFavorite: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.FAVOURITES.BY_ID(id));
  },
};
