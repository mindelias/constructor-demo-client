import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '@/types/api.types';

/**
 * Hook for login mutation
 * Handles login API call and auth state updates
 */
export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
}
