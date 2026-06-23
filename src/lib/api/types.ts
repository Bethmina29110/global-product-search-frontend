export interface User {
  id: string;
  email: string;
  fullName: string;
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
