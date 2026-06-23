export interface User {
  id: string;
  email: string;
  fullName: string;
  address?: string;
  phoneNo?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
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

export interface SearchParams {
  query: string;
  limit?: number;
  useRAG?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  url: string;
  imageUrl?: string;
  source: string;
  rating?: number;
  reviewsCount?: number;
}

export interface SearchResponse {
  query: string;
  results: Product[];
  answer?: string;
}
