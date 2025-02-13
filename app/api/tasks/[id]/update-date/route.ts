// app/api/tasks/[id]/update-date/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/app/db/config';
import { tasks } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { dueDate } = await request.json();
  
  const updatedTask = await db
    .update(tasks)
    .set({ dueDate: new Date(dueDate) })
    .where(eq(tasks.id, parseInt(params.id)))
    .returning();

  return NextResponse.json(updatedTask[0]);
}