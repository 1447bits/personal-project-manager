
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db/config';
import { users } from '@/app/db/schema';
import { comparePasswords, createToken } from '@/app/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePasswords(
      password,
      user[0].password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      id: user[0].id,
      email: user[0].email,
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user[0];

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.log("login route error - ",error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}