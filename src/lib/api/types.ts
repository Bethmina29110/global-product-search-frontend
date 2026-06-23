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
  specs: Record<string, any>;
  confidence: number;
  summary: string;
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
