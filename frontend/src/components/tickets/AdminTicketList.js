"use client"

import { useState } from "react"

const AdminTicketList = ({ tickets, updateTicketStatus }) => {
  const [updating, setUpdating] = useState(null)

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "CLOSED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  // Handle status change
  const handleStatusChange = async (ticketId, status) => {
    setUpdating(ticketId)
    const success = await updateTicketStatus(ticketId, status)
    if (!success) {
      alert("Failed to update ticket status")
    }
    setUpdating(null)
  }

  if (tickets.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There are no tickets in the system yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{ticket.title}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Created by {ticket.userId.name} ({ticket.userId.email}) on {formatDate(ticket.createdAt)}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">{ticket.description}</p>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">Ticket ID: {ticket._id}</span>
            <div className="flex items-center space-x-2">
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                disabled={updating === ticket._id}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
              {updating === ticket._id && <span className="text-xs text-gray-500 dark:text-gray-400">Updating...</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminTicketList

