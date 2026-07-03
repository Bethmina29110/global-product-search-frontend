export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  address?: string;
  phoneNo?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
    path: string;
  };
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  fullName: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  phoneNo?: string;
}

export interface RagProduct {
  title: string;
  category: string;
  specifications: Record<string, any>;
  specs?: Record<string, any>; // legacy fallback
  confidence: number;
  summary: string;
  reasoning?: string;
  score: number;
  productUrl: string;
  imageUrl: string;
  price: string;
  rating: number | null;
  store: string;
}

export interface RagSearchData {
  query: string;
  meta: {
    page: number;
    limit: number;
  };
  topRecommendation?: {
    title: string;
    reason: string;
    score: number;
  };
  products: RagProduct[];
}

export interface SearchProduct {
  title: string;
  price: string;
  rating: number | null;
  imageUrl: string;
  store: string;
  productUrl: string;
}

export interface SearchResultData {
  query: string;
  results: SearchProduct[];
}

export interface Favourite {
  id: number;
  userId: number;
  title: string;
  price?: string;
  imageUrl?: string;
  store?: string;
  productUrl?: string;
  rating?: number;
  category?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export type SaveFavouriteDto = Omit<Favourite, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface SavedSearch {
  id: number;
  userId: number;
  query: string;
  type: string;
  matchesCount: number;
  createdAt: string;
}

export type SaveSearchDto = {
  query: string;
  type: string;
  matchesCount: number;
};
