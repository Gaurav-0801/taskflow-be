import { Response } from "express"
import { AuthService } from "../services/auth.service"
import { AuthRequest } from "../middleware/auth.middleware"

const authService = new AuthService()

export class AuthController {
  async signUp(req: AuthRequest, res: Response) {
    try {
      const { email, password, name } = req.body
      const { user, token } = await authService.signUp(email, password, name)

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
        path: "/",
      })

      res.status(201).json({ user })
    } catch (error: any) {
      if (error.message === "User already exists") {
        return res.status(409).json({ error: error.message })
      }
      res.status(400).json({ error: error.message || "Sign up failed" })
    }
  }

  async signIn(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body
      const { user, token } = await authService.signIn(email, password)

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
        path: "/",
      })

      res.json({ user })
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message })
      }
      res.status(400).json({ error: error.message || "Sign in failed" })
    }
  }

  async signOut(req: AuthRequest, res: Response) {
    res.clearCookie("auth_token", { path: "/" })
    res.json({ message: "Signed out successfully" })
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getCurrentUser(req.userId!)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json({ user })
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get user" })
    }
  }
}

