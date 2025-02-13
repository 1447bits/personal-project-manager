// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db/config';
import { users } from '@/app/db/schema';
import { hashPassword, createToken } from '@/app/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    // Create JWT token
    const token = await createToken({
      id: newUser[0].id,
      email: newUser[0].email,
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.log("register route error - ",error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
