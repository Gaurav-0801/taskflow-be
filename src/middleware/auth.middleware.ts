import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/auth"
import { getDb } from "../utils/db"

export interface AuthRequest extends Request {
  userId?: number
  user?: any
  body: any
  params: any
  cookies: any
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.auth_token

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return res.status(401).json({ error: "Invalid token" })
    }

    // Fetch user from database
    const sql = getDb()
    const users = await sql`
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = ${payload.userId}
    `

    if (users.length === 0) {
      return res.status(401).json({ error: "User not found" })
    }

    req.userId = payload.userId
    req.user = users[0]
    next()
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" })
  }
}

