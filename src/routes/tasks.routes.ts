import { Router } from "express"
import { TasksController } from "../controllers/tasks.controller"
import { authenticate } from "../middleware/auth.middleware"
import { validate } from "../middleware/validation.middleware"
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator"

const router = Router()
const tasksController = new TasksController()

router.get("/", authenticate, tasksController.getTasks.bind(tasksController))
router.post(
  "/",
  authenticate,
  validate(createTaskSchema),
  tasksController.createTask.bind(tasksController)
)
router.put(
  "/:id",
  authenticate,
  validate(updateTaskSchema),
  tasksController.updateTask.bind(tasksController)
)
router.delete(
  "/:id",
  authenticate,
  tasksController.deleteTask.bind(tasksController)
)

export default router

