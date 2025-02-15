import { eq } from "drizzle-orm";
import { db } from "../db/config";
import { projects, tasks, users } from '@/app/db/schema';


export async function GET(request: Request) {


    const allProjects = await db.select().from(projects);
    const allusers = await db.select().from(users);
    const alltasks = await db.select().from(tasks);

    await db.delete(projects).where(eq(projects.id, 5)).returning();
    await db.delete(projects).where(eq(projects.id, 6)).returning();

    return Response.json({ projects: allProjects, users: allusers, tasks: alltasks })


}