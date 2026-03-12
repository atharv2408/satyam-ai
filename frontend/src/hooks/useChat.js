import { useCallback, useRef } from 'react'
import { useChat as useChatContext } from '@context/ChatContext'
import { sendChatMessage, streamChatMessage } from '@services/api'
import * as firestoreService from '@services/firestoreService'
import { useAuth } from '@context/AuthContext' // Import AuthContext to get userId

/**
 * Custom hook for chat functionality
 * Integrates with ChatContext and API services
 */
export function useChatActions() {
    const {
        messages,
        sessionId,
        isLoading,
        error,
        settings,
        addUserMessage,
        addAIMessage,
        setLoading,
        setError,
        clearError,
        setSession,
        updateSettings,
        clearMessages,
        updateMessage,
        setMessages,
        sessions,
        setSessions,
    } = useChatContext()

    const { user } = useAuth() // Get current user

    /**
     * Refresh the list of sessions
     */
    const refreshSessions = useCallback(async () => {
        if (!user) return
        const result = await firestoreService.getUserSessions(user.uid)
        if (result.success) {
            setSessions(result.data)
        }
    }, [setSessions, user])

    /**
     * Send a message and get AI response
     * @param {string} message - The user's message
     */
    const sendMessage = useCallback(async (message) => {
        if (!message.trim() || isLoading) return
        // Guest check - though AuthContext handles this, good to be safe
        if (!user) {
            setError("Please login to save chat history.")
            // Allow sending but warn? Or block? For now, we block saving but allow sending is tricky if we want to save.
            // Let's assume user must be logged in for history features as per requirement.
        }

        // Clear any previous errors
        clearError()

        // Add user message to state
        addUserMessage(message)

        // Set loading state
        setLoading(true)

        // Ensure we have a session ID. If not, create one.
        let currentSessionId = sessionId
        if (!currentSessionId && user) {
            const sessionResult = await firestoreService.createNewSession(user.uid)
            if (sessionResult.success) {
                currentSessionId = sessionResult.id
                setSession(currentSessionId)
                refreshSessions()
            }
        }

        try {
            // Prepare history for RAG context
            // Get last 6 messages, formatted as "User: ..." or "AI: ..."
            const historyContext = messages
                .slice(-6)
                .map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)

            // 1. Send message to FastAPI backend for ANSWER
            // Pass historyContext as 4th argument
            const response = await sendChatMessage(message, currentSessionId, settings, historyContext)

            if (response.success) {
                const { reply, references } = response.data

                // 2. Add AI response to UI
                addAIMessage(reply, references)

                // 3. Save to Firestore (Fire and Forget or Await?)
                // Better to await to ensure consistency
                if (user && currentSessionId) {
                    await firestoreService.saveMessage(user.uid, currentSessionId, 'user', message)
                    await firestoreService.saveMessage(user.uid, currentSessionId, 'ai', reply, references)
                }

            } else {
                throw new Error(response.error)
            }
        } catch (err) {
            setError(err.message || 'Failed to get response. Please try again.')

            // Add error message to chat
            addAIMessage(
                'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.'
            )
        } finally {
            setLoading(false)
        }
    }, [
        sessionId,
        settings,
        isLoading,
        addUserMessage,
        addAIMessage,
        setLoading,
        setError,
        clearError,
        setSession,
        user,
        refreshSessions
    ])

    // Abort controller ref
    const abortControllerRef = useRef(null)

    /**
     * Stop the current generation
     */
    const stopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
            setLoading(false)
        }
    }, [setLoading])

    /**
     * Send a message with streaming response
     * @param {string} message - The user's message
     * @param {function} onChunk - Callback for each chunk
     */
    const sendMessageStreaming = useCallback(async (message, onChunk) => {
        if (!message.trim() || isLoading) return

        clearError()
        addUserMessage(message)

        // 1. Create a placeholder AI message immediately
        setLoading(true)

        // Update/Create AbortController
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        // We need the ID to update it. addAIMessage returns the ID.
        const messageId = addAIMessage('', [])

        // Ensure Session
        let currentSessionId = sessionId
        if (!currentSessionId && user) {
            const sessionResult = await firestoreService.createNewSession(user.uid)
            if (sessionResult.success) {
                currentSessionId = sessionResult.id
                setSession(currentSessionId)
                refreshSessions()
            }
        }

        try {
            let fullResponse = ''

            const result = await streamChatMessage(
                message,
                (chunk) => {
                    fullResponse += chunk
                    onChunk(chunk) // Callback with just the chunk

                    // 2. Update the message content in real-time
                    updateMessage(messageId, { content: fullResponse })
                },
                currentSessionId, // Pass session ID for context if backend supports it
                abortControllerRef.current.signal
            )

            // Final update to ensure consistency
            updateMessage(messageId, { content: fullResponse, isLoading: false })

            // 3. Save to Firestore
            if (user && currentSessionId) {
                await firestoreService.saveMessage(user.uid, currentSessionId, 'user', message)
                await firestoreService.saveMessage(user.uid, currentSessionId, 'ai', fullResponse, []) // Refs not supported in stream yet
            }

        } catch (err) {
            // Ignore abort errors in UI as they are user intended
            if (err.name !== 'AbortError') {
                setError(err.message || 'Streaming failed')
                updateMessage(messageId, {
                    content: 'I apologize, but I encountered an error. Please try again.',
                    isError: true
                })
            } else {
                // Mark as stopped/done without error
                updateMessage(messageId, { isLoading: false })
            }
        } finally {
            abortControllerRef.current = null
            setLoading(false)
        }
    }, [sessionId, isLoading, addUserMessage, addAIMessage, setLoading, setError, clearError, updateMessage, user, refreshSessions, setSession])

    /**
     * Start a new conversation
     */
    const startNewConversation = useCallback(async () => {
        clearMessages()
        setSession(null)
        clearError()
        // Optionally create new session immediately in DB? 
        // Better to wait for first message to avoid empty sessions.
    }, [clearMessages, setSession, clearError])

    /**
     * Change language setting
     * @param {string} language - 'en' or 'hi'
     */
    const changeLanguage = useCallback((language) => {
        updateSettings({ language })
    }, [updateSettings])

    /**
     * Change mode setting
     * @param {string} mode - 'simple' or 'professional'
     */
    const changeMode = useCallback((mode) => {
        updateSettings({ mode })
    }, [updateSettings])

    /**
     * Load a specific chat session
     */
    const loadSession = useCallback(async (id) => {
        setLoading(true)
        try {
            if (!user) {
                setError("Please login to view history.")
                return
            }
            const result = await firestoreService.getSessionMessages(id, user.uid)
            if (result.success) {
                // Map Firestore messages to frontend format
                const formattedMessages = result.data.map(msg => ({
                    id: msg.id || Math.random().toString(),
                    type: msg.role === 'user' ? 'user' : 'ai', // Map role correctly
                    content: msg.content,
                    references: typeof msg.references === 'string' ? JSON.parse(msg.references || '[]') : (msg.references || []),
                    timestamp: msg.timestamp
                }))
                setMessages(formattedMessages)
                setSession(id)
            }
        } catch (err) {
            setError('Failed to load session')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [setLoading, setSession, setMessages, setError, user])

    /**
     * Delete a session
     */
    const deleteSession = useCallback(async (id) => {
        if (!id) return

        // Optimistic update
        setSessions(sessions.filter(s => s.id !== id))

        // If deleting current session, clear it
        if (sessionId === id) {
            clearMessages()
            setSession(null)
        }

        const result = await firestoreService.deleteSession(id)
        if (!result.success) {
            // Revert on failure (simple refresh)
            refreshSessions()
            setError('Failed to delete chat')
        }
    }, [sessionId, sessions, setSessions, setSession, clearMessages, refreshSessions, setError])



    return {
        messages,
        isLoading,
        error,
        settings,
        sendMessage,
        sendMessageStreaming,
        startNewConversation,
        changeLanguage,
        changeMode,
        clearError,
        updateMessage,
        stopGeneration,
        loadSession,
        sessions,
        refreshSessions,
        deleteSession,

    }
}

export default useChatActions
