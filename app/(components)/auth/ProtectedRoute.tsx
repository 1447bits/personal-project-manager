'use client'

// app/components/auth/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import FullPageLoader from '../util/loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true)

  const { login } = useAuthStore();

  useEffect(() => {
    // Check if there's stored auth data
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.token && state.user) {
          login(state.user, state.token);
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    } else {
      router.push('/login');
    }
  }, [login, router]);


  if (isLoading) {
    return <FullPageLoader />
  }

  return <>{children}</>;
}