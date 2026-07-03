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
  DASHBOARD: {
    OVERVIEW: "/dashboard/overview",
    RECENT_QUERIES: "/dashboard/recent-saved-queries",
    SEMANTIC_ACTIVITY: "/dashboard/semantic-search-activity",
  },
  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    SEARCH_TREND: "/analytics/search-trend",
    TOP_CATEGORIES: "/analytics/top-categories",
    TOP_STORES: "/analytics/top-stores",
    PRICE_DISTRIBUTION: "/analytics/price-distribution",
  },
};
