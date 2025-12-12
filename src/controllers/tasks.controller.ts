import { Response } from "express"
import { TasksService } from "../services/tasks.service"
import { AuthRequest } from "../middleware/auth.middleware"

const tasksService = new TasksService()

export class TasksController {
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await tasksService.getTasks(req.userId!)
      res.json({ tasks })
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch tasks" })
    }
  }

  async createTask(req: AuthRequest, res: Response) {
    try {
      const task = await tasksService.createTask(req.userId!, req.body)
      res.status(201).json({ task })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create task" })
    }
  }

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.id)
      const task = await tasksService.updateTask(req.userId!, {
        id: taskId,
        ...req.body,
      })

      if (!task) {
        return res.status(404).json({ error: "Task not found" })
      }

      res.json({ task })
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: error.message })
      }
      res.status(400).json({ error: error.message || "Failed to update task" })
    }
  }

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.id)
      await tasksService.deleteTask(req.userId!, taskId)
      res.json({ message: "Task deleted successfully" })
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: error.message })
      }
      res.status(400).json({ error: error.message || "Failed to delete task" })
    }
  }
}

