import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/auth.routes"
import tasksRoutes from "./routes/tasks.routes"
import profileRoutes from "./routes/profile.routes"
import { errorHandler } from "./middleware/error.middleware"

// Load .env file from the backend root directory (one level up from src/)
// When running with ts-node-dev, __dirname will be backend/src/
// So we go up one level to find backend/.env
const envPath = path.resolve(__dirname, "../.env")
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error("❌ Error loading .env file:", result.error.message)
  console.log("📁 Looking for .env at:", envPath)
} else {
  console.log("✅ Environment variables loaded successfully!")
  console.log("📁 Loaded from:", envPath)
  console.log("🔑 Variables found:")
  console.log("   - PORT:", process.env.PORT || "not set (using default: 3001)")
  console.log("   - DATABASE_URL:", process.env.DATABASE_URL ? "✓ set" : "✗ not set")
  console.log("   - JWT_SECRET:", process.env.JWT_SECRET ? "✓ set" : "✗ not set")
  console.log("   - CORS_ORIGIN:", process.env.CORS_ORIGIN || "not set (using default: http://localhost:3000)")
  console.log("   - NODE_ENV:", process.env.NODE_ENV || "not set")
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", tasksRoutes)
app.use("/api/profile", profileRoutes)

// Health check
app.get("/health", (req: express.Request, res: express.Response): void => {
  res.json({ status: "ok" })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

