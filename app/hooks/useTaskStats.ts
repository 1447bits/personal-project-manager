
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
  const response = await fetch('/api/tasks/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch task statistics');
  }
  return response.json();
}

export function useTaskStats() {
  return useQuery<TaskStats, Error>({
    queryKey: ['taskStats'],
    queryFn: fetchTaskStats,
  });
}