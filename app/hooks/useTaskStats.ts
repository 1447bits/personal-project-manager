
// app/hooks/useTaskStats.ts
'use client'
import { useQuery } from '@tanstack/react-query';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byProject: Record<number, number>;
  completionRate: number;
}

async function fetchTaskStats(): Promise<TaskStats> {
  const token = localStorage.getItem("token")
  const response = await fetch('/api/tasks/stats', {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch task statistics');
  }
  return response.json();
}

export function useTaskStats() {
  return useQuery<TaskStats, Error>({
    queryKey: ['taskStats'],
    queryFn: fetchTaskStats,
    refetchOnMount: true,    // Refetch when component mounts
    staleTime: 0,           // Consider data stale immediately
  });
}