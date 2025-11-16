import { apiClient } from '@/lib/api/client';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};
