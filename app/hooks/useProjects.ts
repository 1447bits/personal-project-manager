
// // app/hooks/useProjects.ts
// 'use client'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Project } from '@/app/store/types';
// import { useProjectStore } from '@/app/store/projectStore';
// import React from 'react';

// const token = localStorage.getItem("token")

// async function fetchProjects() {
//     const response = await fetch('/api/projects', {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch projects');
//     }
//     return response.json();
// }

// async function createProject(project: Omit<Project, 'id' | 'createdAt'>) {
//     const response = await fetch('/api/projects', {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify(project),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to create project');
//     }
//     return response.json();
// }

// export function useProjects() {
//     const setProjects = useProjectStore((state) => state.setProjects);

//     const query = useQuery<Project[], Error>({
//         queryKey: ['projects'],
//         queryFn: fetchProjects,
//     });


//     React.useEffect(() => {
//         if (query.data) {
//             setProjects(query.data)
//         }
//     }, [query, setProjects])

//     const queryClient = useQueryClient();

//     const createMutation = useMutation({
//         mutationFn: createProject,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['projects'] });
//         },
//     });

//     return {
//         ...query,
//         createProject: createMutation.mutate,
//     };
// }



'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Task } from '@/app/store/types';
import { useProjectStore } from '@/app/store/projectStore';
import React from 'react';

const token = localStorage.getItem("token");

const fetchProjects = async () => {
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
};

const fetchProjectTasks = async (projectId: number) => {
    const response = await fetch(`/api/projects/tasks/${projectId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch project tasks');
    }
    return response.json();
};

const createProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(project),
    });
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    return response.json();
};

export function useProjects(projectId?: number) {
    const setProjects = useProjectStore((state) => state.setProjects);
    const queryClient = useQueryClient();

    // Query for all projects
    const projectsQuery = useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    // Query for specific project tasks if projectId is provided
    const tasksQuery = useQuery<Task[], Error>({
        queryKey: ['projectTasks', projectId],
        queryFn: () => fetchProjectTasks(projectId!),
        enabled: !!projectId, // Only run this query if projectId is provided
    });

    // Update project store when data changes
    React.useEffect(() => {
        if (projectsQuery.data) {
            setProjects(projectsQuery.data);
        }
    }, [projectsQuery.data, setProjects]);

    // Project creation mutation
    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    return {
        // Project-related data and functions
        projects: projectsQuery.data,
        isLoadingProjects: projectsQuery.isLoading,
        isErrorProjects: projectsQuery.isError,
        errorProjects: projectsQuery.error,
        createProject: createMutation.mutate,
        
        // Task-related data
        tasks: tasksQuery.data,
        isLoadingTasks: tasksQuery.isLoading,
        isErrorTasks: tasksQuery.isError,
        errorTasks: tasksQuery.error,
    };
}