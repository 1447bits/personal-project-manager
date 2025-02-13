'use client'
import React, { useState, useMemo } from 'react';
import { useProjects } from '@/app/hooks/useProjects';
import { useTasks } from '@/app/hooks/useTasks';
import { Task } from '@/app/store/types';
import { format } from 'date-fns';
import { Search, Plus, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/app/store/authStore';

const TasksPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [projectFilter, setProjectFilter] = useState<string>('');
    const [showCompleted, setShowCompleted] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const user = useAuthStore(state => state.user);


    const { data: projects } = useProjects();
    const { data: tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
    const { toast } = useToast();

    // Filtered tasks based on search term and filters
    const filteredTasks = useMemo(() => {
        if (!tasks) return [];

        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesProject = !projectFilter || task?.projectId?.toString() === projectFilter;
            const matchesCompletion = showCompleted ? true : !task.completed;

            return matchesSearch && matchesPriority && matchesProject && matchesCompletion;
        });
    }, [tasks, searchTerm, priorityFilter, projectFilter, showCompleted]);

    const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        if (!user) { return }

        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        type T_priority = "low" | "medium" | "high" | undefined;

        const dueDateValue = formData.get('dueDate') as string;

        const taskData: Partial<Task> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            priority: formData.get('priority') as T_priority,
            projectId: parseInt(formData.get('projectId') as string),
            userId: user.id as number,
        };

        // Only add dueDate if it exists and is valid
        if (dueDateValue) {
            taskData.dueDate = new Date(dueDateValue);
        }

        try {
            if (selectedTask) {
                updateTask({ taskId: selectedTask.id, updates: taskData });
                toast({ title: "Task updated successfully" });
            } else {
                await createTask(taskData);
                toast({ title: "Task created successfully" });
            }
            setIsDialogOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: "Failed to save task",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                toast({ title: "Task deleted successfully" });
            } catch (error) {
                console.log(error)
                toast({
                    title: "Error",
                    description: "Failed to delete task",
                    variant: "destructive"
                });
            }
        }
    };

    const handleToggleComplete = async (task: Task) => {
        try {
            await updateTask({
                taskId: task.id,
                updates: { completed: !task.completed }
            });
            toast({
                title: task.completed ? "Task marked as pending" : "Task marked as completed"
            });
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: "Failed to update task status",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setSelectedTask(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleTaskSubmit} className="space-y-4">
                            <Input
                                name="title"
                                placeholder="Task title"
                                defaultValue={selectedTask?.title}
                                required
                            />
                            <Input
                                name="description"
                                placeholder="Description"
                                defaultValue={selectedTask?.description}
                            />
                            <Select name="priority" defaultValue={selectedTask?.priority || 'medium'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select name="projectId" defaultValue={selectedTask?.projectId?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects?.map(project => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                name="dueDate"
                                defaultValue={selectedTask?.dueDate ?
                                    format(new Date(selectedTask.dueDate), 'yyyy-MM-dd') :
                                    undefined}
                            />
                            <Button type="submit" className="w-full">
                                {selectedTask ? 'Update Task' : 'Create Task'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={projectFilter} onValueChange={setProjectFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects?.length !== 0 &&
                                    <>
                                        <SelectItem value={projects ? projects[0].id.toString() : "some"}>All projects</SelectItem>
                                        {projects?.map(project => (
                                            <SelectItem key={project.id} value={project.id.toString()}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                }
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => setShowCompleted(!showCompleted)}
                        >
                            {showCompleted ? 'Hide Completed' : 'Show Completed'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                        No tasks found
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleToggleComplete(task)}>
                                            {task.completed ? (
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </button>
                                        <div>
                                            <h3 className="font-medium">{task.title}</h3>
                                            {task.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {task.dueDate && (
                                            <span className="text-sm text-muted-foreground">
                                                {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {task.priority}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksPage;