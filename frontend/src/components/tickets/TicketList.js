"use client"

import { useState } from "react"
import LoadingSkeleton from "../ui/LoadingSkeleton"

const TicketList = ({ tickets, loading }) => {
  const [expandedTicket, setExpandedTicket] = useState(null)

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "badge-primary"
      case "IN_PROGRESS":
        return "badge-warning"
      case "CLOSED":
        return "badge-success"
      default:
        return "badge-secondary"
    }
  }

  if (loading) {
    return <LoadingSkeleton type="list" />
  }

  if (tickets.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">No tickets found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create a new ticket to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className={`card card-hover animate-scale-in ${
            expandedTicket === ticket._id ? "ring-2 ring-primary-500 dark:ring-primary-400" : ""
          }`}
          onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
        >
          <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{ticket.title}</h3>
              <span className={`badge ${getStatusStyle(ticket.status)}`}>{ticket.status.replace("_", " ")}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Created on {formatDate(ticket.createdAt)}</p>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedTicket === ticket._id ? "max-h-96" : "max-h-24"
            }`}
          >
            <div className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{ticket.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">Ticket ID: {ticket._id}</p>
            <button
              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={(e) => {
                e.stopPropagation()
                setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)
              }}
            >
              {expandedTicket === ticket._id ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TicketList
