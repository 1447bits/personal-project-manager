
// app/hooks/useProjects.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/app/store/types';
import { useProjectStore } from '@/app/store/projectStore';
import React from 'react';

const token = localStorage.getItem("token")

async function fetchProjects() {
    const response = await fetch('/api/projects', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    return response.json();
}

async function createProject(project: Omit<Project, 'id' | 'createdAt'>) {
    const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
    });
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    return response.json();
}

export function useProjects() {
    const setProjects = useProjectStore((state) => state.setProjects);

    const query = useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });


    React.useEffect(() => {
        if (query.data) {
            setProjects(query.data)
        }
    }, [query, setProjects])

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    return {
        ...query,
        createProject: createMutation.mutate,
    };
}