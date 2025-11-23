import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '@/types/api.types';

/**
 * Hook for register mutation
 * Handles registration API call and auth state updates
 */
export function useRegister() {
  const { register } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
}
