const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { generateAccessToken, generateRefreshToken, authenticate } = require("../middleware/auth")
const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      })
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      })
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      })
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role === "ADMIN" ? "ADMIN" : "USER",
    })

    // Save user
    await user.save()

    // Generate tokens
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      status: "error",
      message: "Error creating user",
    })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get tokens
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      status: "error",
      message: "Login failed",
    })
  }
})

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "No refresh token provided",
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Find user
    const user = await User.findById(decoded.id)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      })
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    // Update refresh token
    user.refreshToken = newRefreshToken
    await user.save()

    // Set new refresh token in HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      status: "success",
      data: {
        accessToken,
      },
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    res.status(401).json({
      status: "error",
      message: "Invalid refresh token",
    })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookies
// @access  Private
router.post("/logout", authenticate, async (req, res) => {
  try {
    // Clear refresh token in database
    const user = await User.findById(req.user.id)
    if (user) {
      user.refreshToken = null
      await user.save()
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken")

    res.json({
      status: "success",
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      status: "error",
      message: "Logout failed",
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken")
    res.json({
      status: "success",
      data: {
        user,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      status: "error",
      message: "Error fetching user data",
    })
  }
})

module.exports = router

