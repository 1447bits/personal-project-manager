// app/api/tasks/[id]/update-date/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/app/db/config';
import { tasks } from '@/app/db/schema';
import { and, eq } from 'drizzle-orm';
import { getUserIdFromHeader } from '@/app/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  const userId: number | null = await getUserIdFromHeader(request)
  if (!userId) return new Response("Invalid Token", { status: 401 })

  const { dueDate } = await request.json();

  const updatedTask = await db
    .update(tasks)
    .set({ dueDate: new Date(dueDate) })
    .where(and(eq(tasks.id, parseInt(params.id)), eq(tasks.userId, userId)))
    .returning();

  return NextResponse.json(updatedTask[0]);
}