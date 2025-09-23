import { create } from 'zustand'
import { authApi } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true })
    try {
      const tokenData = await authApi.login(credentials)
      
      // Store token first
      localStorage.setItem('token', tokenData.access_token)
      set({ 
        token: tokenData.access_token, 
        isAuthenticated: true
      })
      
      // Then get user data (now the token is available for the request)
      const user = await authApi.getCurrentUser()
      
      set({ 
        user, 
        isLoading: false 
      })
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  },

  register: async (userData) => {
    set({ isLoading: true })
    try {
      await authApi.register(userData)
      set({ isLoading: false })
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isAuthenticated: false })
      return
    }

    try {
      const user = await authApi.getCurrentUser()
      set({ user, isAuthenticated: true })
    } catch (error) {
      localStorage.removeItem('token')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))