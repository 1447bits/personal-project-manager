
// app/hooks/useUsers.ts
'use client'
import { useQuery } from '@tanstack/react-query';
import { User } from '@/app/store/types';

async function fetchUsers() {

  const token = localStorage.getItem("token")

  const response = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}