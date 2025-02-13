
// // app/hooks/useTasks.ts
// 'use client'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Task } from '@/app/store/types';
// import { useTaskStore } from '@/app/store/taskStore';
// import React from 'react';

// interface TaskFilters {
//     projectId?: number;
//     priority?: string;
//     completed?: boolean;
// }

// async function fetchTasks(filters?: TaskFilters) {
//     const queryParams = new URLSearchParams();
//     if (filters) {
//         Object.entries(filters).forEach(([key, value]) => {
//             if (value !== undefined) {
//                 queryParams.append(key, value.toString());
//             }
//         });
//     }

//     const response = await fetch(`/api/tasks?${queryParams}`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch tasks');
//     }
//     return response.json();
// }

// async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
//     const response = await fetch('/api/tasks', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(task),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to create task');
//     }
//     return response.json();
// }

// async function updateTask(taskId: number, updates: Partial<Task>) {
//     const response = await fetch(`/api/tasks/${taskId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updates),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to update task');
//     }
//     return response.json();
// }

// async function deleteTask(taskId: number) {
//     const response = await fetch(`/api/tasks/${taskId}`, {
//         method: 'DELETE',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to delete task');
//     }
//     return response.json();
// }

// export function useTasks(filters?: TaskFilters) {
//     const setTasks = useTaskStore((state) => state.setTasks);

//     const query = useQuery<Task[], Error>({
//         queryKey: ['tasks', filters],
//         queryFn: () => fetchTasks(filters),
//     });

//     React.useEffect(() => {
//         if (query.data) {
//             setTasks(query.data)
//         }
//     }, [query, setTasks])

//     const queryClient = useQueryClient();

//     const createMutation = useMutation({
//         mutationFn: createTask,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['tasks'] });
//         },
//     });

//     const updateMutation = useMutation({
//         mutationFn: ({ taskId, updates }: { taskId: number; updates: Partial<Task> }) =>
//             updateTask(taskId, updates),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['tasks'] });
//         },
//     });

//     const deleteMutation = useMutation({
//         mutationFn: deleteTask,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['tasks'] });
//         },
//     });

//     return {
//         ...query,
//         createTask: createMutation.mutate,
//         updateTask: updateMutation.mutate,
//         deleteTask: deleteMutation.mutate,
//     };
// }


'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/app/store/types';
import { useTaskStore } from '@/app/store/taskStore';
import React from 'react';

const token = localStorage.getItem("token")

interface TaskFilters {
    projectId?: number;
    priority?: string;
    completed?: boolean;
}

async function fetchTasks(filters?: TaskFilters) {
    const queryParams = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });
    }

    const response = await fetch(`/api/tasks?${queryParams}`, {
        method: "get",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tasks');
    }
    const data = await response.json();
    return data;
}

async function createTask(task: Partial<Task>) {
    console.log("calling create task")
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
    }
    return response.json();
}

// async function updateTask(taskId: number, updates: Partial<Task>) {
//     const response = await fetch(`/api/tasks/${taskId}`, {
//         method: 'PUT',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify(updates),
//     });
//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to update task');
//     }
//     return response.json();
// }

async function updateTask({ taskId, updates }: { taskId: number, updates: Partial<Task> }) {
    const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
    }
    return response.json();
}

async function deleteTask(taskId: number) {
    const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
    }
    return response.json();
}

export function useTasks(filters?: TaskFilters) {
    const setTasks = useTaskStore((state) => state.setTasks);

    const query = useQuery<Task[], Error>({
        queryKey: ['tasks', filters],
        queryFn: () => fetchTasks(filters),
        retry: 1,
    });

    React.useEffect(() => {
        if (query.data) {
            setTasks(query.data);
        }
    }, [query.data, setTasks]);

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (task: Partial<Task>) => createTask(task),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ taskId, updates }: { taskId: number; updates: Partial<Task> }) =>
            updateTask({ taskId, updates }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    return {
        ...query,
        createTask: createMutation.mutate,
        updateTask: updateMutation.mutate,
        deleteTask: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        createError: createMutation.error,
        updateError: updateMutation.error,
        deleteError: deleteMutation.error,
    };
}