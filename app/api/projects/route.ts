// app/api/projects/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/app/db/config';
import { projects } from '@/app/db/schema';
import { getUserIdFromHeader } from '@/app/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {

    const userId: number | null = await getUserIdFromHeader(request)
    if (!userId) return new Response("Invalid Token", { status: 401 })

    const allProjects = await db.select().from(projects).where(eq(projects.userId, userId));
    return Response.json(allProjects);
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    const userId: number | null = await getUserIdFromHeader(request)
    if (!userId) return new Response("Invalid Token", { status: 401 })

    const body = await request.json();
    const { name, description } = body;

    const newProject = await db.insert(projects).values({
      name,
      description,
      userId,
    }).returning();

    return Response.json(newProject[0]);
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
