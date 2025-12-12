import { Request, Response, NextFunction } from "express"

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err)

  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }

  if (err.message === "Unauthorized") {
    return res.status(401).json({ error: "Unauthorized" })
  }

  return res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
}

