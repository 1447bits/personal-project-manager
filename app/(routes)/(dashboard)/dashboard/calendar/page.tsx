'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '@/app/hooks/useTasks';
import { Task } from '@/app/store/types';
import {
    format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
    isSameDay, addMonths, subMonths, startOfWeek, endOfWeek
} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const ViewType = {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day'
} as const;

type ViewTypeKey = keyof typeof ViewType;

const TaskCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewType, setViewType] = useState<typeof ViewType[ViewTypeKey]>(ViewType.MONTH);
    const { data: tasks } = useTasks();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const token = localStorage.getItem("token")

    const calendarDays = useMemo(() => {
        let start, end;

        if (viewType === ViewType.MONTH) {
            start = startOfWeek(startOfMonth(currentDate));
            end = endOfWeek(endOfMonth(currentDate));
        } else if (viewType === ViewType.WEEK) {
            start = startOfWeek(currentDate);
            end = endOfWeek(currentDate);
        } else {
            start = currentDate;
            end = currentDate;
        }

        return eachDayOfInterval({ start, end });
    }, [currentDate, viewType]);

    const getTasksForDate = (date: Date): Task[] => {
        return tasks?.filter(task =>
            task.dueDate && isSameDay(new Date(task.dueDate), date)
        ) || [];
    };

    const navigate = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentDate(prev => viewType === ViewType.MONTH ? subMonths(prev, 1) :
                new Date(prev.setDate(prev.getDate() - (viewType === ViewType.WEEK ? 7 : 1))));
        } else {
            setCurrentDate(prev => viewType === ViewType.MONTH ? addMonths(prev, 1) :
                new Date(prev.setDate(prev.getDate() + (viewType === ViewType.WEEK ? 7 : 1))));
        }
    };

    // Update task mutation
    const updateTaskMutation = useMutation({
        mutationFn: async ({ taskId, date }: { taskId: number; date: Date }) => {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dueDate: date.toISOString(),
                    updatedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Task due date updated successfully",
            });
            // Refresh tasks data
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update task due date",
                variant: "destructive",
            });
            console.error('Error updating task:', error);
        },
    });

    const handleDrop = async (e: React.DragEvent, date: Date) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));

        if (isNaN(taskId)) {
            toast({
                title: "Error",
                description: "Invalid task data",
                variant: "destructive",
            });
            return;
        }

        // Normalize date to start of day
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        try {
            await updateTaskMutation.mutateAsync({
                taskId,
                date: normalizedDate,
            });
        } catch (error) {
            console.error('Error in handleDrop:', error);
        }
    };

    // Visual feedback component for the calendar day cell
    const DayCell = ({ day, children }: { day: Date; children: React.ReactNode }) => {
        const isUpdating = updateTaskMutation.isPending;

        return (
            <div
                className={`min-h-24 p-2 border rounded-md relative ${isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-50'
                    } ${isUpdating ? 'opacity-50' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-blue-50'); // Visual feedback for drag over
                }}
                onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-blue-50');
                }}
                onDrop={(e) => {
                    e.currentTarget.classList.remove('bg-blue-50');
                    handleDrop(e, day);
                }}
            >
                {isUpdating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                )}
                {children}
            </div>
        );
    };



    return (
        <div>


            <Card className="w-full max-w-6xl mx-auto">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => navigate('prev')}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-xl font-semibold">
                                {format(currentDate, viewType === ViewType.MONTH ? 'MMMM yyyy' :
                                    viewType === ViewType.WEEK ? "'Week of' MMM d, yyyy" : 'EEEE, MMM d, yyyy')}
                            </h2>
                            <Button variant="outline" onClick={() => navigate('next')}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            {(Object.keys(ViewType) as ViewTypeKey[]).map((type) => (
                                <Button
                                    key={type}
                                    variant={viewType === ViewType[type] ? "default" : "outline"}
                                    onClick={() => setViewType(ViewType[type])}
                                >
                                    {type.charAt(0) + type.slice(1).toLowerCase()}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day) => (
                            <DayCell key={day.toISOString()} day={day}>
                                <div className="font-medium text-sm mb-1">
                                    {format(day, 'd')}
                                </div>
                                <div className="space-y-1">
                                    {getTasksForDate(day).map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('taskId', task.id.toString());
                                                e.currentTarget.classList.add('opacity-50'); // Visual feedback when dragging
                                            }}
                                            onDragEnd={(e) => {
                                                e.currentTarget.classList.remove('opacity-50');
                                            }}
                                            className={`text-xs p-1 rounded cursor-move transition-all ${task.priority === 'high' ? 'bg-red-100 hover:bg-red-200' :
                                                task.priority === 'medium' ? 'bg-yellow-100 hover:bg-yellow-200' :
                                                    'bg-green-100 hover:bg-green-200'
                                                }`}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                </div>
                            </DayCell>
                        ))}
                    </div>

                </CardContent>
            </Card>
        </div>

    );
};

export default TaskCalendar;