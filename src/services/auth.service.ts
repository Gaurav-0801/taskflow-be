import { getDb } from "../utils/db"
import { hashPassword, verifyPassword, createToken } from "../utils/auth"
import type { User } from "../types"

export class AuthService {
  async signUp(email: string, password: string, name: string) {
    const sql = getDb()

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      throw new Error("User already exists")
    }

    // Create user
    const passwordHash = await hashPassword(password)
    const users = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name, created_at, updated_at
    `

    const user = users[0]
    const token = await createToken(user.id)

    return { user, token }
  }

  async signIn(email: string, password: string) {
    const sql = getDb()

    const users = await sql`
      SELECT id, password_hash FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      throw new Error("Invalid credentials")
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    // Fetch full user data
    const fullUsers = await sql`
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = ${user.id}
    `

    const token = await createToken(user.id)

    return { user: fullUsers[0], token }
  }

  async getCurrentUser(userId: number): Promise<User | null> {
    const sql = getDb()
    const users = await sql`
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = ${userId}
    `

    return users[0] || null
  }
}

