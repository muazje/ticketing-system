"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken")
        if (storedToken) {
          setAccessToken(storedToken)
          // Fetch user data with the stored token
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          setUser(response.data.data.user)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        // Clear invalid token
        localStorage.removeItem("accessToken")
        setAccessToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Register user
  const register = async (userData) => {
    try {
      setError(null)
      const response = await axios.post(`${API_URL}/api/auth/register`, userData)
      const { user, accessToken: token } = response.data.data

      localStorage.setItem("accessToken", token)
      setAccessToken(token)
      setUser(user)

      return user
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      throw error
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setError(null)
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password }, { withCredentials: true })
      const { user, accessToken: token } = response.data.data

      localStorage.setItem("accessToken", token)
      setAccessToken(token)
      setUser(user)

      return user
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      throw error
    }
  }

  // Logout user
  const logout = async () => {
    try {
      if (accessToken) {
        await axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          },
        )
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      setAccessToken(null)
      setUser(null)
    }
  }

  // Create axios instance with auth header
  const authAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  })

  // Add auth header to requests
  authAxios.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Handle 401 responses
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Try to refresh the token
          const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {}, { withCredentials: true })
          const { accessToken: newToken } = response.data.data

          localStorage.setItem("accessToken", newToken)
          setAccessToken(newToken)

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return authAxios(originalRequest)
        } catch (refreshError) {
          // If refresh fails, logout user
          logout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  const contextValue = {
    user,
    accessToken,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!accessToken,
    authAxios,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

