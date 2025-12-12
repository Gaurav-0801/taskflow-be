import { Router } from "express"
import { ProfileController } from "../controllers/profile.controller"
import { authenticate } from "../middleware/auth.middleware"
import { validate } from "../middleware/validation.middleware"
import { updateProfileSchema } from "../validators/profile.validator"

const router = Router()
const profileController = new ProfileController()

router.get("/", authenticate, profileController.getProfile.bind(profileController))
router.put(
  "/",
  authenticate,
  validate(updateProfileSchema),
  profileController.updateProfile.bind(profileController)
)

export default router

