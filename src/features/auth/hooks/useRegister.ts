import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { useAuthStore } from './useAuth';
import type { RegisterData } from '../types/auth.types';

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
}
