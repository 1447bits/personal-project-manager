'use client'
import React from 'react';
import { useProjects } from '@/app/hooks/useProjects';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Project } from '@/app/store/types';

export default function ProjectsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);
    const queryClient = useQueryClient();

    const userData = localStorage.getItem("user")
    const userId = JSON.parse(userData ? userData : "{}").userId

    // Fetch projects using the custom hook
    const { data: projects, isLoading, error, createProject } = useProjects();
    console.log(projects)

    // Update and delete mutations
    const updateProjectMutation = useMutation({
        mutationFn: async (project: Project) => {
            const token = localStorage.getItem("token")
            const response = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: {  'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            });
            if (!response.ok) throw new Error('Failed to update project');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setEditingProject(null);
        },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: async (projectId: number) => {
            const token = localStorage.getItem("token")
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {  'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to delete project');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    // Form handling
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const projectData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            userId: userId, // Replace with actual user ID from auth
        };

        if (editingProject) {
            await updateProjectMutation.mutateAsync({
                ...editingProject,
                ...projectData,
            });
            setIsCreateDialogOpen(false);
        } else {
            await createProject(projectData);
            setIsCreateDialogOpen(false);
        }
    };

    if (isLoading) return <div className="p-4">Loading projects...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" />
                            New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingProject ? 'Edit Project' : 'Create New Project'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={editingProject?.name}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={editingProject?.description}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {editingProject ? 'Update Project' : 'Create Project'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((project) => (
                    <Card key={project.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{project.name}</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setEditingProject(project);
                                        setIsCreateDialogOpen(true);
                                    }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteProjectMutation.mutate(project.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Tasks</h3>
                                <div className="space-y-2">
                                    {/* Tasks will be implemented here */}
                                    <p className="text-sm text-gray-500">No tasks yet</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}