// API URL
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// API Config
export const API_CONFIG = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}