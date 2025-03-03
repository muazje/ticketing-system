"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Loader2,
  MoreVertical,
  Search,
  Settings,
  Tag,
  Trash2,
  Users,
} from "lucide-react"
import LoadingSkeleton from "../components/ui/LoadingSkeleton"

const AdminDashboard = () => {
  const { authAxios } = useContext(AuthContext)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
    dateRange: "ALL",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [sortBy, setSortBy] = useState("newest")
  const [updating, setUpdating] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
    highPriority: 0,
  })
  const [selectedTickets, setSelectedTickets] = useState([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Fetch tickets with filters and pagination
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch tickets and stats in parallel
        const [ticketsResponse, statsResponse] = await Promise.all([
          authAxios.get(
            `/api/tickets?${new URLSearchParams({
              page: pagination.page.toString(),
              limit: pagination.limit.toString(),
              ...(filters.status !== "ALL" && { status: filters.status }),
              ...(filters.priority !== "ALL" && { priority: filters.priority }),
              ...(searchTerm && { search: searchTerm }),
              sortBy,
            })}`,
          ),
          authAxios.get("/api/tickets/stats"),
        ])

        setTickets(ticketsResponse.data.tickets)
        setPagination((prev) => ({
          ...prev,
          total: ticketsResponse.data.pagination.total,
          pages: ticketsResponse.data.pagination.pages,
        }))
        setStats(statsResponse.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to fetch tickets")
        setLoading(false)
      }
    }

    fetchData()
  }, [authAxios, filters, pagination.page, pagination.limit, searchTerm, sortBy])

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (!selectedTickets.length) return

    try {
      setBulkActionLoading(true)

      switch (action) {
        case "delete":
          await Promise.all(selectedTickets.map((id) => authAxios.delete(`/api/tickets/${id}`)))
          setTickets(tickets.filter((ticket) => !selectedTickets.includes(ticket._id)))
          break

        case "close":
          await Promise.all(selectedTickets.map((id) => authAxios.put(`/api/tickets/${id}`, { status: "CLOSED" })))
          setTickets(
            tickets.map((ticket) => (selectedTickets.includes(ticket._id) ? { ...ticket, status: "CLOSED" } : ticket)),
          )
          break

        default:
          break
      }

      setSelectedTickets([])
    } catch (error) {
      setError("Failed to perform bulk action")
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Update ticket
  const updateTicket = async (ticketId, updates) => {
    try {
      setUpdating(ticketId)
      const response = await authAxios.put(`/api/tickets/${ticketId}`, updates)

      setTickets(tickets.map((ticket) => (ticket._id === ticketId ? response.data : ticket)))

      return true
    } catch (error) {
      setError("Failed to update ticket")
      return false
    } finally {
      setUpdating(null)
    }
  }

  // Delete ticket
  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return

    try {
      await authAxios.delete(`/api/tickets/${ticketId}`)
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId))
    } catch (error) {
      setError("Failed to delete ticket")
    }
  }

  // Format date with time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 7) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } else if (days > 0) {
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return "Just now"
    }
  }

  // Get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
        }
      case "IN_PROGRESS":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
        }
      case "CLOSED":
        return {
          bg: "bg-green-50 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
        }
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/30",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-800",
        }
    }
  }

  // Get priority style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return {
          bg: "bg-red-50 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
        }
      case "MEDIUM":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/30",
          text: "text-orange-700 dark:text-orange-300",
          border: "border-orange-200 dark:border-orange-800",
        }
      case "LOW":
        return {
          bg: "bg-green-50 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
        }
      default:
        return getStatusStyle("default")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage and monitor all support tickets</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleBulkAction("export")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.open}</p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.closed}</p>
            </div>
          </div>
        </div>
        <div className="card card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.highPriority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTickets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{selectedTickets.length} selected</span>
            <button
              onClick={() => handleBulkAction("close")}
              disabled={bulkActionLoading}
              className="rounded-lg bg-primary-500 px-3 py-1 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              Close All
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              disabled={bulkActionLoading}
              className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              Delete All
            </button>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      {loading ? (
        <LoadingSkeleton type="table" />
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">No tickets found</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="w-8 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTickets.length === tickets.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTickets(tickets.map((t) => t._id))
                          } else {
                            setSelectedTickets([])
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Ticket Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tickets.map((ticket) => {
                    const statusStyle = getStatusStyle(ticket.status)
                    const priorityStyle = getPriorityStyle(ticket.priority)
                    return (
                      <tr
                        key={ticket._id}
                        className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <td className="w-8 px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTickets([...selectedTickets, ticket._id])
                              } else {
                                setSelectedTickets(selectedTickets.filter((id) => id !== ticket._id))
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{ticket.title}</span>
                            <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {ticket.description.length > 100
                                ? `${ticket.description.substring(0, 100)}...`
                                : ticket.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {ticket.userId.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.userId.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={ticket.status}
                            onChange={(e) => updateTicket(ticket._id, { status: e.target.value })}
                            disabled={updating === ticket._id}
                            className={`rounded-lg border px-2 py-1 text-sm ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={ticket.priority}
                            onChange={(e) => updateTicket(ticket._id, { priority: e.target.value })}
                            disabled={updating === ticket._id}
                            className={`rounded-lg border px-2 py-1 text-sm ${priorityStyle.border} ${priorityStyle.bg} ${priorityStyle.text}`}
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatTimeAgo(ticket.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {updating === ticket._id && (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                            )}
                            <button
                              onClick={() => deleteTicket(ticket._id)}
                              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard

