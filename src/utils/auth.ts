import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { TextEncoder } from "util"

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET_KEY)
}

export async function verifyToken(
  token: string
): Promise<{ userId: number } | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as { userId: number }
  } catch {
    return null
  }
}

