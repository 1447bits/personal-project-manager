// app/api/projects/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/app/db/config';
import { projects } from '@/app/db/schema';

export async function GET() {
  try {
    const allProjects = await db.select().from(projects);
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
    const body = await request.json();
    const { name, description, userId } = body;

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
