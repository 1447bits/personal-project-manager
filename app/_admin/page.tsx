import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FolderKanban, CheckSquare } from 'lucide-react';
import { db } from "../db/config";
import { projects, tasks, users } from '@/app/db/schema';


export default async function AdminPage() {

    const allProjects = await db.select().from(projects);
    const allUsers = await db.select().from(users);
    const allTasks = await db.select().from(tasks);

    const data = { projects: allProjects, users: allUsers, tasks: allTasks }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.users.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.projects.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.tasks.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Overview of all registered users in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="projects">
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>List of all projects in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>User ID</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>{project.id}</TableCell>
                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>{project.description}</TableCell>
                                            <TableCell>{project.userId}</TableCell>
                                            <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks</CardTitle>
                            <CardDescription>Overview of all tasks across projects.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Project ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>{task.id}</TableCell>
                                            <TableCell>{task.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={task.completed ? "outline" : "secondary"}>
                                                    {task.completed ? "Completed" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    task.priority === "high" ? "destructive" :
                                                        task.priority === "medium" ? "destructive" : "default"
                                                }>
                                                    {task.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{task.projectId}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}