const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  })
}

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  })
}

// Verify access token middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      })
    }

    const token = authHeader.split(" ")[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Decoded token:", decoded) // Add this line for debugging

      const user = await User.findById(decoded.id).select("-password -refreshToken")
      console.log("Found user:", user) // Add this line for debugging

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "User not found",
        })
      }

      req.user = user
      next()
    } catch (error) {
      console.error("Token verification error:", error) // Add this line for debugging
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Token expired",
          code: "TOKEN_EXPIRED",
        })
      }

      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      })
    }
  } catch (error) {
    console.error("Authentication error:", error) // Add this line for debugging
    return res.status(500).json({
      status: "error",
      message: "Authentication error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Check if user is admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "error",
      message: "Admin access required",
    })
  }
  next()
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  isAdmin,
}

