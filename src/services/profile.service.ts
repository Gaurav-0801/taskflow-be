import { getDb } from "../utils/db"
import type { User, UpdateProfileInput } from "../types"

export class ProfileService {
  async getProfile(userId: number): Promise<User | null> {
    const sql = getDb()
    const users = await sql`
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = ${userId}
    `
    return users[0] || null
  }

  async updateProfile(
    userId: number,
    input: UpdateProfileInput
  ): Promise<User | null> {
    const sql = getDb()

    // Check if email is being updated and if it's already taken
    if (input.email) {
      const existing = await sql`
        SELECT id FROM users WHERE email = ${input.email} AND id != ${userId}
      `
      if (existing.length > 0) {
        throw new Error("Email already in use")
      }
    }

    // Build update query safely
    if (input.name !== undefined && input.email !== undefined) {
      const users = await sql`
        UPDATE users
        SET name = ${input.name}, email = ${input.email}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, updated_at
      `
      return users[0] || null
    } else if (input.name !== undefined) {
      const users = await sql`
        UPDATE users
        SET name = ${input.name}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, updated_at
      `
      return users[0] || null
    } else if (input.email !== undefined) {
      const users = await sql`
        UPDATE users
        SET email = ${input.email}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, updated_at
      `
      return users[0] || null
    }

    return this.getProfile(userId)
  }
}

