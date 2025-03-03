const express = require("express")
const Ticket = require("../models/Ticket")
const { authenticate, isAdmin } = require("../middleware/auth")
const router = express.Router()

// @route   GET /api/tickets
// @desc    Get all tickets (admin) or user tickets
// @access  Private
router.get("/", authenticate, async (req, res) => {
  try {
    console.log("Starting ticket retrieval...")
    let tickets = []

    // Add query parameters for filtering and pagination
    const { status, search, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    // Build query object
    const query = {}

    // Add status filter if provided
    if (status && ["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
      query.status = status
    }

    // Add search filter if provided
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Add user filter for non-admin users
    if (req.user.role !== "ADMIN") {
      query.userId = req.user._id
    }

    // Execute query with pagination
    tickets = await Ticket.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .lean()
      .exec()

    // Get total count for pagination
    const total = await Ticket.countDocuments(query)

    console.log(`Successfully retrieved ${tickets.length} tickets`)
    return res.json({
      tickets,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in GET /api/tickets:", error)
    return res.status(500).json({
      message: "Failed to retrieve tickets",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @route   POST /api/tickets
// @desc    Create a new ticket
// @access  Private
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, priority = "MEDIUM" } = req.body

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Please provide title and description" })
    }

    // Validate title length
    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({ message: "Title must be between 3 and 100 characters" })
    }

    // Validate description length
    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({ message: "Description must be between 10 and 1000 characters" })
    }

    const ticket = new Ticket({
      title,
      description,
      priority,
      userId: req.user._id,
    })

    const savedTicket = await ticket.save()

    // Populate user information before sending response
    await savedTicket.populate("userId", "name email")
    console.log("Created new ticket:", savedTicket)

    return res.status(201).json(savedTicket)
  } catch (error) {
    console.error("Error in POST /api/tickets:", error)
    return res.status(500).json({
      message: "Failed to create ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @route   PUT /api/tickets/:id
// @desc    Update ticket
// @access  Private
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body
    const ticketId = req.params.id

    // Find the ticket
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    // Check authorization
    if (req.user.role !== "ADMIN" && ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this ticket" })
    }

    // Validate fields if provided
    if (title) {
      if (title.length < 3 || title.length > 100) {
        return res.status(400).json({ message: "Title must be between 3 and 100 characters" })
      }
      ticket.title = title
    }

    if (description) {
      if (description.length < 10 || description.length > 1000) {
        return res.status(400).json({ message: "Description must be between 10 and 1000 characters" })
      }
      ticket.description = description
    }

    // Only admin can update status
    if (status && req.user.role === "ADMIN") {
      if (!["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
      }
      ticket.status = status
    }

    // Only admin can update priority
    if (priority && req.user.role === "ADMIN") {
      if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) {
        return res.status(400).json({ message: "Invalid priority" })
      }
      ticket.priority = priority
    }

    const updatedTicket = await ticket.save()
    await updatedTicket.populate("userId", "name email")

    console.log("Updated ticket:", updatedTicket)
    return res.json(updatedTicket)
  } catch (error) {
    console.error("Error in PUT /api/tickets/:id:", error)
    return res.status(500).json({
      message: "Failed to update ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket
// @access  Private
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    // Check authorization (only admin or ticket owner can delete)
    if (req.user.role !== "ADMIN" && ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this ticket" })
    }

    await ticket.deleteOne()
    console.log("Deleted ticket:", req.params.id)

    return res.json({ message: "Ticket deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/tickets/:id:", error)
    return res.status(500).json({
      message: "Failed to delete ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Add this new route for ticket statistics
// @route   GET /api/tickets/stats
// @desc    Get ticket statistics
// @access  Private/Admin
router.get("/stats", authenticate, isAdmin, async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $facet: {
          // Count total tickets
          total: [{ $count: "count" }],
          // Count by status
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          // Count by priority
          byPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ])

    // Format the response
    const formattedStats = {
      total: stats[0].total[0]?.count || 0,
      open: stats[0].byStatus.find((s) => s._id === "OPEN")?.count || 0,
      inProgress: stats[0].byStatus.find((s) => s._id === "IN_PROGRESS")?.count || 0,
      closed: stats[0].byStatus.find((s) => s._id === "CLOSED")?.count || 0,
      highPriority: stats[0].byPriority.find((p) => p._id === "HIGH")?.count || 0,
    }

    return res.json(formattedStats)
  } catch (error) {
    console.error("Error in GET /api/tickets/stats:", error)
    return res.status(500).json({
      message: "Failed to retrieve ticket statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get("/:id", authenticate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("userId", "name email").lean().exec()

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    // Check if user is authorized to view this ticket
    if (req.user.role !== "ADMIN" && ticket.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this ticket" })
    }

    return res.json(ticket)
  } catch (error) {
    console.error("Error in GET /api/tickets/:id:", error)
    return res.status(500).json({
      message: "Failed to retrieve ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

module.exports = router

