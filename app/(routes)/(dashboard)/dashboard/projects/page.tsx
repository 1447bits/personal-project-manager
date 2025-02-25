'use client'
import React from 'react';
import { useProjects } from '@/app/hooks/useProjects';
import { useTasks } from '@/app/hooks/useTasks';
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
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';
import { Project } from '@/app/store/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjectsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = React.useState<number | null>(null);
    const queryClient = useQueryClient();

    const userData = localStorage.getItem("user");
    const userId = JSON.parse(userData ? userData : "{}").userId;

    // Fetch projects using the custom hook
    const { projects, isLoadingProjects, createProject } = useProjects();
    const noProjects = !projects || !projects.length || projects.length === 0

    // Fetch tasks for all projects
    const { data: tasks, createTask, updateTask, deleteTask } = useTasks();

    // Update and delete mutations for projects
    const updateProjectMutation = useMutation({
        mutationFn: async (project: Project) => {
            const token = localStorage.getItem("token")
            const response = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to delete project');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    // Project form handling
    const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const projectData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            userId: userId,
        };

        if (editingProject) {
            await updateProjectMutation.mutateAsync({
                ...editingProject,
                ...projectData,
            });
        } else {
            await createProject(projectData);
        }
        setIsCreateDialogOpen(false);
    };

    // Task form handling
    const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const taskData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            priority: formData.get('priority') as "low" | "medium" | "high" | undefined,
            projectId: selectedProject ? selectedProject : undefined,
            dueDate: new Date(formData.get('dueDate') as string)

        };

        await createTask(taskData);
        setIsTaskDialogOpen(false);
    };

    if (isLoadingProjects) return <div className="p-4">Loading projects...</div>;

    const getProjectTasks = (projectId: number) => {
        return tasks?.filter(task => task.projectId === projectId) || [];
    };

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
                        <form onSubmit={handleProjectSubmit} className="space-y-4">
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

            {noProjects && <p className='w-full text-gray-500 mt-56 text-center'>No Projects To SHow</p>}

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
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Tasks</h3>
                                    <Dialog open={isTaskDialogOpen && selectedProject === project.id}
                                        onOpenChange={(open) => {
                                            setIsTaskDialogOpen(open);
                                            if (open) setSelectedProject(project.id);
                                        }}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <PlusCircle className="w-4 h-4 mr-2" />
                                                Add Task
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Create New Task</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleTaskSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="title">Task Title</Label>
                                                    <Input id="title" name="title" required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" name="description" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="priority">Priority</Label>
                                                    <Select name="priority" defaultValue="medium">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select priority" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="low">Low</SelectItem>
                                                            <SelectItem value="medium">Medium</SelectItem>
                                                            <SelectItem value="high">High</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input
                                                    type="date"
                                                    name="dueDate"
                                                    defaultValue={'yyyy-mm-dd'}
                                                />
                                                <Button type="submit" className="w-full">
                                                    Create Task
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="space-y-2 max-h-16 overflow-auto">
                                    {getProjectTasks(project.id).length === 0 ? (
                                        <p className="text-sm text-gray-500">No tasks yet</p>
                                    ) : (
                                        getProjectTasks(project.id).map((task) => (
                                            <div key={task.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => updateTask({
                                                            taskId: task.id,
                                                            updates: { completed: !task.completed }
                                                        })}
                                                    >
                                                        {task.completed ?
                                                            <Check className="w-4 h-4 text-green-500" /> :
                                                            <div className="w-4 h-4 border rounded" />
                                                        }
                                                    </Button>
                                                    <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteTask(task.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}