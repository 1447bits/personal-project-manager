// app/store/types.ts
export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    projectId?: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    userId: number;
    createdAt: Date;
}
