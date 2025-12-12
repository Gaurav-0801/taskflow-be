import { Response } from "express"
import { ProfileService } from "../services/profile.service"
import { AuthRequest } from "../middleware/auth.middleware"

const profileService = new ProfileService()

export class ProfileController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await profileService.getProfile(req.userId!)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json({ user })
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get profile" })
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await profileService.updateProfile(req.userId!, req.body)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json({ user })
    } catch (error: any) {
      if (error.message === "Email already in use") {
        return res.status(409).json({ error: error.message })
      }
      res.status(400).json({ error: error.message || "Failed to update profile" })
    }
  }
}

