const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        filename: String,
        path: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Add indexes for better query performance
ticketSchema.index({ status: 1 })
ticketSchema.index({ priority: 1 })
ticketSchema.index({ createdAt: -1 })
ticketSchema.index({ title: "text", description: "text" })

// Add a method to add comments
ticketSchema.methods.addComment = async function (userId, text) {
  this.comments.push({ userId, text })
  return this.save()
}

// Add a method to update ticket status with validation
ticketSchema.methods.updateStatus = async function (newStatus, userId) {
  if (!["OPEN", "IN_PROGRESS", "CLOSED"].includes(newStatus)) {
    throw new Error("Invalid status")
  }
  this.status = newStatus
  // Optionally add a comment about the status change
  await this.addComment(userId, `Status changed to ${newStatus}`)
  return this.save()
}

const Ticket = mongoose.model("Ticket", ticketSchema)

module.exports = Ticket

