const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const ticketRoutes = require("./routes/tickets")

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware for parsing JSON and cookies
app.use(express.json())
app.use(cookieParser())

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)

// Connect to MongoDB with all options explicitly set
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Connected to MongoDB")
    // Verify the connection by getting the connection state
    const state = mongoose.connection.readyState
    console.log("MongoDB connection state:", state) // 1 = connected, 0 = disconnected
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1) // Exit if we can't connect to the database
  })

// Monitor MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected")
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Ticketing System API is running")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err)
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

