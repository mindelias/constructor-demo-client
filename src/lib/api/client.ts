import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string }>) => {
    const message = error.response?.data?.message || 'An error occurred';

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Permission denied:', message);
    }

    // Handle 500 - Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
