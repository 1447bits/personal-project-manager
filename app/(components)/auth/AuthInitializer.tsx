// app/components/auth/AuthInitializer.tsx
'use client'
import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { redirect } from 'next/navigation';

export default function AuthInitializer({ doRedirect }: { doRedirect: boolean }) {
  const { login } = useAuthStore();

  useEffect(() => {
    // Check if there's stored auth data
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.token && state.user) {
          login(state.user, state.token);
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    } else {
      if (doRedirect) redirect("/login")
    }
  }, [login, doRedirect]);

  return null;
}