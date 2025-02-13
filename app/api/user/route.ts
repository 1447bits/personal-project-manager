// app/api/users/route.ts
import { db } from '@/app/db/config';
import { users } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    const { email, name } = body;

    // Basic validation
    if (!email || !name) {
      return Response.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        createdAt: new Date()
      })
      .returning();

    return Response.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Optional: GET route to fetch all users
export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return Response.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}