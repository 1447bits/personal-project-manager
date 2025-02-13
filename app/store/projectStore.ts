
// app/store/projectStore.ts
import { create } from 'zustand';
import { Project } from './types';

interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProject: (projectId: number, updatedProject: Partial<Project>) => void;
    deleteProject: (projectId: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    getCurrentProject: (projectId: number) => Project | undefined;
    getUserProjects: (userId: number) => Project[];
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
    projects: [],
    isLoading: false,
    error: null,
    setProjects: (projects) => set({ projects }),
    addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
    updateProject: (projectId, updatedProject) =>
        set((state) => ({
            projects: state.projects.map((project) =>
                project.id === projectId
                    ? { ...project, ...updatedProject }
                    : project
            ),
        })),
    deleteProject: (projectId) =>
        set((state) => ({
            projects: state.projects.filter(
                (project) => project.id !== projectId
            ),
        })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    getCurrentProject: (projectId) =>
        get().projects.find((project) => project.id === projectId),
    getUserProjects: (userId) =>
        get().projects.filter((project) => project.userId === userId),
}));