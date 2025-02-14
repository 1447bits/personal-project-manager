import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/app/db/config';
import { tasks, projects } from '@/app/db/schema';
import { getUserIdFromHeader } from "@/app/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    const userId: number | null = await getUserIdFromHeader(request);
    if (!userId) return new Response("Invalid Token", { status: 401 });

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return new Response("Invalid project ID", { status: 400 });
    }

    // First verify the project belongs to the user
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      )
    });

    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    // Fetch all tasks for the project
    const projectTasks = await db.query.tasks.findMany({
      where: and(
        eq(tasks.projectId, projectId),
        eq(tasks.userId, userId)
      ),
      orderBy: [tasks.createdAt]
    });

    return NextResponse.json(projectTasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}