import api from '@/lib/api/axios';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/api.types';

/**
 * Auth API functions
 */

// Register new user
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  return response.data.data;
};

// Login user
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data.data;
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};

// Logout user (if backend has logout endpoint)
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Even if API call fails, we'll clear local data
    console.error('Logout error:', error);
  }
};
