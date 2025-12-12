export interface User {
  id: number
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: Task["status"]
  priority?: Task["priority"]
  due_date?: string
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: number
}

export interface UpdateProfileInput {
  name?: string
  email?: string
}

