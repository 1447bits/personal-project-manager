
// app/api/projects/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/app/db/config';
import { projects } from '@/app/db/schema';
import { and, eq } from 'drizzle-orm';
import { getUserIdFromHeader } from '@/app/lib/auth';


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const userId: number | null = await getUserIdFromHeader(request)
    if (!userId) return new Response("Invalid Token", { status: 401 })

    const { id } = await params; // Remove await as params is not a promise
    const body = await request.json();

    // Only pick the fields we want to update
    const { name, description } = body;
    const updateData = {
      name,
      description,
      userId,
      updatedAt: new Date(), // Add this if you have an updatedAt field
    };

    const updatedProject = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    if (!updatedProject.length) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return Response.json(updatedProject[0]);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const userId: number | null = await getUserIdFromHeader(_request)
    if (!userId) return new Response("Invalid Token", { status: 401 })

    const { id } = await params;

    const deletedProject = await db
      .delete(projects)
      .where(and(eq(projects.id, parseInt(id)), eq(projects.userId, userId)))
      .returning();

    if (!deletedProject.length) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return Response.json(deletedProject[0]);
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}