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

    if (req.user.role === "ADMIN") {
      console.log("Admin user, fetching all tickets...")
      tickets = await Ticket.find().populate("userId", "name email").sort({ createdAt: -1 }).lean().exec()
    } else {
      console.log("Regular user, fetching user tickets...")
      tickets = await Ticket.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean().exec()
    }

    console.log(`Successfully retrieved ${tickets.length} tickets`)
    return res.json(tickets)
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
    const { title, description } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: "Please provide title and description" })
    }

    const ticket = new Ticket({
      title,
      description,
      userId: req.user._id,
    })

    const savedTicket = await ticket.save()
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
// @desc    Update ticket status (admin only)
// @access  Private/Admin
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body

    if (!["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    ticket.status = status
    const updatedTicket = await ticket.save()
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

