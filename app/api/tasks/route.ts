// app/api/tasks/route.ts
import { NextRequest } from 'next/server';
import { db } from '../../db/config';
import { tasks } from '../../db/schema';
import { getUserIdFromHeader } from '@/app/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
    try {

        const userId: number | null = await getUserIdFromHeader(req)
        if (!userId) return new Response("Invalid Token", { status: 401 })

        const allTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
        return Response.json(allTasks);
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {

        const userId: number | null = await getUserIdFromHeader(request)
        if (!userId) return new Response("Invalid Token", { status: 401 })

        const body = await request.json();
        const { title, description, priority, dueDate, projectId } = body;

        const newTask = await db.insert(tasks).values({
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            projectId,
            userId,
            completed: false,
        }).returning();

        return Response.json(newTask[0]);
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

