import { getDb } from "../utils/db"
import type { CreateTaskInput, UpdateTaskInput, Task } from "../types"

export class TasksService {
  async getTasks(userId: number): Promise<Task[]> {
    const sql = getDb()
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return tasks
  }

  async createTask(userId: number, input: CreateTaskInput): Promise<Task> {
    const sql = getDb()
    const tasks = await sql`
      INSERT INTO tasks (user_id, title, description, status, priority, due_date)
      VALUES (
        ${userId},
        ${input.title},
        ${input.description || null},
        ${input.status || "pending"},
        ${input.priority || "medium"},
        ${input.due_date || null}
      )
      RETURNING *
    `
    return tasks[0]
  }

  async updateTask(
    userId: number,
    input: UpdateTaskInput
  ): Promise<Task | null> {
    const sql = getDb()

    // Verify task belongs to user
    const existing = await sql`
      SELECT id FROM tasks WHERE id = ${input.id} AND user_id = ${userId}
    `

    if (existing.length === 0) {
      throw new Error("Task not found")
    }

    const tasks = await sql`
      UPDATE tasks
      SET 
        title = ${input.title !== undefined ? input.title : sql`title`},
        description = ${input.description !== undefined ? input.description : sql`description`},
        status = ${input.status !== undefined ? input.status : sql`status`},
        priority = ${input.priority !== undefined ? input.priority : sql`priority`},
        due_date = ${input.due_date !== undefined ? input.due_date : sql`due_date`},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${input.id} AND user_id = ${userId}
      RETURNING *
    `

    return tasks[0] || null
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    const sql = getDb()

    // Verify task belongs to user
    const existing = await sql`
      SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${userId}
    `

    if (existing.length === 0) {
      throw new Error("Task not found")
    }

    await sql`
      DELETE FROM tasks
      WHERE id = ${taskId} AND user_id = ${userId}
    `
  }
}

