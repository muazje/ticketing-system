"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import TicketList from "../components/tickets/TicketList"
import CreateTicketForm from "../components/tickets/CreateTicketForm"

const UserDashboard = () => {
  const { authAxios } = useContext(AuthContext)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user's tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await authAxios.get("/api/tickets")
        setTickets(res.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch tickets")
        setLoading(false)
      }
    }

    fetchTickets()
  }, [authAxios])

  // Add new ticket to the list
  const addTicket = (ticket) => {
    setTickets([ticket, ...tickets])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">My Support Tickets</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          ) : (
            <TicketList tickets={tickets} />
          )}
        </div>
        <div>
          <CreateTicketForm addTicket={addTicket} />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

