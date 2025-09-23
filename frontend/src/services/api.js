import axios from 'axios'

// API Configuration - automatically detects environment
const getApiBaseUrl = () => {
  // In production (Render.com or other hosting), use environment variable or relative URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '/api/v1'
  }
  // In development, use localhost
  return 'http://localhost:8000/api/v1'
}

const API_BASE_URL = getApiBaseUrl()

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (credentials) => {
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me')
    return response.data
  },
}

export const documentsApi = {
  getDocuments: async () => {
    const response = await apiClient.get('/documents/')
    return response.data
  },

  uploadDocument: async (file, title, description) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    if (description) {
      formData.append('description', description)
    }

    const response = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteDocument: async (documentId) => {
    await apiClient.delete(`/documents/${documentId}`)
  },

  getDocumentContent: async (documentId) => {
    const response = await apiClient.get(`/documents/${documentId}/content`)
    return response.data
  },
}

export const chatApi = {
  sendMessage: async (message, conversationId) => {
    const response = await apiClient.post('/chat/', {
      message,
      conversation_id: conversationId,
    })
    return response.data
  },

  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations')
    return response.data
  },

  getConversationMessages: async (conversationId) => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  deleteConversation: async (conversationId) => {
    await apiClient.delete(`/chat/conversations/${conversationId}`)
  },
}

export default apiClient