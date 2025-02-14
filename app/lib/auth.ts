// app/lib/auth.ts
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload: JWTPayload | undefined) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET).catch((err) => {
      throw(err)
    });
    return verified.payload;
  } catch (err) {
    console.log("error verifying jwt token", err)
    return null;
  }
}

export async function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}


export async function getUserIdFromHeader(req: Request): Promise<null | number> {

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("No header")
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);

  if (payload && typeof payload === 'object' && 'id' in payload) {
    return payload.id as number; // Assuming the user ID is stored in the payload as 'userId'
  }

  return null;
}