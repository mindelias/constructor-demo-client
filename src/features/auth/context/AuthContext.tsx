import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, LoginRequest, RegisterRequest } from '@/types/api.types';
import * as authApi from '../api/authApi';
import { initializeSocket, disconnectSocket } from '@/lib/api/socket';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Initialize Socket.IO connection
          initializeSocket(storedToken);

          // Optionally refresh user data from server
          try {
            const freshUser = await authApi.getCurrentUser();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (error) {
            // If token is invalid, clear auth state
            console.error('Token validation failed:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        const response = await authApi.login(data);

        // Save to state
        setToken(response.token);
        setUser(response.user);

        // Save to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Initialize Socket.IO connection
        initializeSocket(response.token);

        // Redirect to home
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    [navigate]
  );

  // Register function
  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await authApi.register(data);

        // Save to state
        setToken(response.token);
        setUser(response.user);

        // Save to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Initialize Socket.IO connection
        initializeSocket(response.token);

        // Redirect to home
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(() => {
    // Call logout API
    authApi.logout().catch(console.error);

    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // Disconnect socket
    disconnectSocket();

    // Redirect to login
    navigate('/login');
  }, [navigate]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authApi.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('User refresh error:', error);
      // If refresh fails, logout
      logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
