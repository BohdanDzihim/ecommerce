'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { api } from './api';

export const useSetupApiInterceptor = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await api.post('auth/token/refresh/');
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            router.push('/users/login');
            console.error('Token refresh failed', refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [logout, router]);
};
