import axios from 'axios'
import { API_CONFIG } from '@constants'

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 120000, // 2 minutes (Hardcoded to force update)
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized access')
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                    break
                case 403:
                    console.error('Forbidden')
                    break
                case 404:
                    console.error('Resource not found')
                    break
                case 500:
                    console.error('Server error')
                    break
                default:
                    console.error('An error occurred')
            }
        } else if (error.request) {
            console.error('Network error - no response received')
        } else {
            console.error('Error setting up request')
        }
        return Promise.reject(error)
    }
)

// ============================================
// AUTH API SERVICES
// ============================================

export const login = async (username, password) => {
    // Defines form data for OAuth2
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export const signup = async (name, email, password) => {
    const response = await apiClient.post('/auth/signup', {
        name,
        email,
        password
    })
    return response.data
}

// ============================================
// CHAT API SERVICES
// ============================================

/**
 * Send a chat message to the FastAPI backend
 * @param {string} message - The user's message
 * @param {string} sessionId - Optional session ID for conversation context
 * @param {object} options - Additional options (language, mode, etc.)
 * @returns {Promise<object>} - The AI response
 */
export const sendChatMessage = async (message, sessionId = null, options = {}) => {
    try {
        // Backend expects { "query": "text", "session_id": 123 }
        const payload = { query: message }
        if (sessionId) {
            payload.session_id = sessionId
        }

        const response = await apiClient.post(API_CONFIG.CHAT_ENDPOINT, payload)

        // Backend returns { "answer": "text", "session_id": 123, "sources": [...] }
        return {
            success: true,
            data: {
                reply: response.data.answer,
                references: response.data.sources || [],
                session_id: response.data.session_id // Get session_id from backend response
            },
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || error.message || 'Failed to send message',
        }
    }
}

/**
 * Mock stream chat response (Backend doesn't support streaming yet)
 * We'll use the normal API and "fake" a stream for UI consistency
 */
export const streamChatMessage = async (message, onChunk, sessionId = null, signal = null) => {
    try {
        // Call the normal non-streaming endpoint
        const responseData = await sendChatMessage(message, sessionId)

        if (!responseData.success) {
            throw new Error(responseData.error)
        }

        const fullText = responseData.data.reply

        // Simulate streaming (Typewriter effect)
        let currentIndex = 0
        const totalLength = fullText.length

        while (currentIndex < totalLength) {
            // Check for abort
            if (signal?.aborted) {
                throw new DOMException('Aborted', 'AbortError')
            }

            // Random chunk size (1 to 4 chars) for natural feeling
            const chunkSize = Math.floor(Math.random() * 4) + 1
            const chunk = fullText.slice(currentIndex, currentIndex + chunkSize)
            onChunk(chunk)

            currentIndex += chunkSize

            // Random delay (10ms to 30ms)
            await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(resolve, Math.floor(Math.random() * 20) + 10)

                // Ensure we also reject the promise if aborted during the wait
                if (signal) {
                    signal.addEventListener('abort', () => {
                        clearTimeout(timeoutId)
                        reject(new DOMException('Aborted', 'AbortError'))
                    }, { once: true })
                }
            })
        }
        return responseData.data

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Generation stopped by user')
            return // Clean exit
        }
        console.error('Streaming simulation error:', error)
        throw error
    }
}

/**
 * Get chat history for a session
 * @param {string} sessionId - The session ID
 * @returns {Promise<object>} - Chat history
 */
export const getSessionMessages = async (sessionId) => {
    try {
        const response = await apiClient.get(`/chat/session/${sessionId}`)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || 'Failed to fetch chat messages',
        }
    }
}

/**
 * Get all chat sessions for user
 */
export const getUserSessions = async () => {
    try {
        const response = await apiClient.get('/chat/history')
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

/**
 * Create a new chat session
 * @returns {Promise<object>} - New session details
 */
export const createChatSession = async (title = "New Chat") => {
    try {
        const response = await apiClient.post('/chat/session', { title })
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || 'Failed to create session',
        }
    }
}

/**
 * Delete a chat session
 * @param {string} sessionId 
 */
export const deleteChatSession = async (sessionId) => {
    try {
        await apiClient.delete(`/chat/session/${sessionId}`)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || 'Failed to delete session'
        }
    }
}

// Export the axios instance for custom requests
export default apiClient
