import { NextResponse } from 'next/server';
import { eq,  sql } from 'drizzle-orm';
import { db } from '@/app/db/config'; 
import { tasks } from '@/app/db/schema';
import { getUserIdFromHeader } from '@/app/lib/auth';

export async function GET(request: Request) {
    try {

        const userId: number | null = await getUserIdFromHeader(request)
        if (!userId) return new Response("Invalid Token", { status: 401 })

        // Get all tasks for the user
        const userTasks = await db.select({
            id: tasks.id,
            completed: tasks.completed,
            priority: tasks.priority,
            projectId: tasks.projectId,
        })
            .from(tasks)
            .where(eq(tasks.userId, userId));

        // Calculate basic stats
        const total = userTasks.length;
        const completed = userTasks.filter(task => task.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        // Calculate priority stats
        const byPriority = {
            high: userTasks.filter(task => task.priority === 'high').length,
            medium: userTasks.filter(task => task.priority === 'medium').length,
            low: userTasks.filter(task => task.priority === 'low').length,
        };

        // Calculate project stats
        const byProject = userTasks.reduce((acc, task) => {
            if (task.projectId) {
                acc[task.projectId] = (acc[task.projectId] || 0) + 1;
            }
            return acc;
        }, {} as Record<number, number>);

        // Additional performance stats
        const recentStats = await db
            .select({
                completedLastWeek: sql<number>`
          COUNT(*) FILTER (WHERE completed = true 
          AND updated_at >= NOW() - INTERVAL '7 days')
        `,
                totalLastWeek: sql<number>`
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')
        `,
            })
            .from(tasks)
            .where(eq(tasks.userId, userId));

        const stats = {
            total,
            completed,
            pending,
            byPriority,
            byProject,
            completionRate: Number(completionRate.toFixed(2)),
            recentPerformance: {
                completedLastWeek: Number(recentStats[0].completedLastWeek),
                totalLastWeek: Number(recentStats[0].totalLastWeek),
            }
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching task statistics:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}