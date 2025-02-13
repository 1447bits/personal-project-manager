
// // app/api/tasks/[id]/route.ts
// import { NextRequest } from 'next/server';
// import { db } from '@/app/db/config';
// import { tasks } from '@/app/db/schema';
// import { eq } from 'drizzle-orm';

// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
    
//     const updatedTask = await db
//       .update(tasks)
//       .set(body)
//       .where(eq(tasks.id, parseInt(id)))
//       .returning();

//     if (!updatedTask.length) {
//       return Response.json(
//         { error: 'Task not found' },
//         { status: 404 }
//       );
//     }

//     return Response.json(updatedTask[0]);
//   } catch (error) {
//     console.log(error)
//     return Response.json(
//       { error: 'Failed to update task' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(_request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = await params;
    
//     const deletedTask = await db
//       .delete(tasks)
//       .where(eq(tasks.id, parseInt(id)))
//       .returning();

//     if (!deletedTask.length) {
//       return Response.json(
//         { error: 'Task not found' },
//         { status: 404 }
//       );
//     }

//     return Response.json(deletedTask[0]);
//   } catch (error) {
//     console.log(error)
//     return Response.json(
//       { error: 'Failed to delete task' },
//       { status: 500 }
//     );
//   }
// }


// app/api/tasks/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/app/db/config';
import { tasks } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Extract and format fields according to schema
    const updateData = {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.completed !== undefined && { completed: body.completed }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.projectId !== undefined && { projectId: body.projectId }),
      ...(body.userId !== undefined && { userId: body.userId }),
      ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
      updatedAt: new Date(),
    };
    
    const updatedTask = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, parseInt(id)))
      .returning();

    if (!updatedTask.length) {
      return Response.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return Response.json(updatedTask[0]);
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const deletedTask = await db
      .delete(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .returning();

    if (!deletedTask.length) {
      return Response.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return Response.json(deletedTask[0]);
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}