import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { Favourite, SaveFavouriteDto } from "./types";

export const favoritesApi = {
  getFavorites: async (): Promise<Favourite[]> => {
    const response = await apiClient.get<Favourite[]>(ENDPOINTS.FAVOURITES.BASE);
    // Based on standard NestJS responses or our ApiResponse wrapper, the data might be in response.data.data or response.data
    // Checking standard structure from controller without ApiResponse wrapper, so it might just be response.data
    return response.data;
  },

  saveFavorite: async (data: SaveFavouriteDto): Promise<Favourite> => {
    const response = await apiClient.post<Favourite>(ENDPOINTS.FAVOURITES.BASE, data);
    return response.data;
  },

  removeFavorite: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.FAVOURITES.BY_ID(id));
  },
};
