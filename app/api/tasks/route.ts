// app/api/tasks/route.ts
import { NextRequest } from 'next/server';
import { db } from '../../db/config';
import { tasks } from '../../db/schema';

export async function GET() {
    try {
        const allTasks = await db.select().from(tasks);
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
        const body = await request.json();
        const { title, description, priority, dueDate, projectId, userId } = body;

        console.log({
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            projectId,
            userId,
            completed: false,
        })

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

