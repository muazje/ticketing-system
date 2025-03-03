"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const CreateTicketForm = ({ addTicket }) => {
  const { authAxios } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { title, description } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await authAxios.post("/api/tickets", formData)
      addTicket(res.data)
      setFormData({
        title: "",
        description: "",
      })
      setSuccess("Ticket created successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card animate-slide-up">
      <div className="border-b border-gray-200 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New Ticket</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Submit a new support request</p>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mx-4 mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
          <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            required
            placeholder="Brief description of the issue"
            className="input-modern mt-1"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Provide details about your issue"
            className="input-modern mt-1"
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="button-primary w-full">
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="ml-2">Creating ticket...</span>
            </div>
          ) : (
            "Submit Ticket"
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateTicketForm

