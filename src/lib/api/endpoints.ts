export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/users/me",
  },
  RAG: {
    SEARCH: "/rag/search",
  },
  SEARCH: {
    NORMAL: "/search",
  },
  FAVOURITES: {
    BASE: "/favourites",
    BY_ID: (id: number) => `/favourites/${id}`,
  },
  SAVED_SEARCH: {
    BASE: "/saved-search",
    BY_ID: (id: number) => `/saved-search/${id}`,
  },
};
