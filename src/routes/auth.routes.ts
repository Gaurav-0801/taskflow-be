import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth.middleware"
import { validate } from "../middleware/validation.middleware"
import { signUpSchema, signInSchema } from "../validators/auth.validator"

const router = Router()
const authController = new AuthController()

router.post("/signup", validate(signUpSchema), authController.signUp.bind(authController))
router.post("/signin", validate(signInSchema), authController.signIn.bind(authController))
router.post("/signout", authController.signOut.bind(authController))
router.get("/me", authenticate, authController.getMe.bind(authController))

export default router

