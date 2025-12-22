import { useCallback, useRef } from 'react'
import { useChat as useChatContext } from '@context/ChatContext'
import { sendChatMessage, streamChatMessage, getSessionMessages, getUserSessions, deleteChatSession } from '@services/api'

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

    /**
     * Refresh the list of sessions
     */
    const refreshSessions = useCallback(async () => {
        const result = await getUserSessions()
        if (result.success) {
            setSessions(result.data)
        }
    }, [setSessions])

    /**
     * Send a message and get AI response
     * @param {string} message - The user's message
     */
    const sendMessage = useCallback(async (message) => {
        if (!message.trim() || isLoading) return

        // Clear any previous errors
        clearError()

        // Add user message to state
        addUserMessage(message)

        // Set loading state
        setLoading(true)

        try {
            // Send message to FastAPI backend
            const response = await sendChatMessage(message, sessionId, settings)

            if (response.success) {
                const { reply, references, session_id } = response.data

                // Update session ID if new
                if (session_id && session_id !== sessionId) {
                    setSession(session_id)
                    refreshSessions() // Refresh list on new session
                }

                // Add AI response
                addAIMessage(reply, references)
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
                sessionId,
                abortControllerRef.current.signal
            )

            // Update session ID if new
            if (result && result.session_id && result.session_id !== sessionId) {
                setSession(result.session_id)
                refreshSessions() // Refresh list on new session
            }

            // Final update to ensure consistency (and maybe add references if backend provides them later)
            // For now reference is empty as backend doesn't send it in stream yet
            updateMessage(messageId, { content: fullResponse, isLoading: false })

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
    }, [sessionId, isLoading, addUserMessage, addAIMessage, setLoading, setError, clearError, updateMessage])

    /**
     * Start a new conversation
     */
    const startNewConversation = useCallback(() => {
        clearMessages()
        setSession(null)
        clearError()
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
            const result = await getSessionMessages(id)
            if (result.success) {
                // Map backend messages to frontend format
                const formattedMessages = result.data.map(msg => ({
                    id: msg.id || Math.random().toString(),
                    type: msg.role,
                    content: msg.content,
                    references: [],
                    timestamp: msg.created_at
                }))
                setMessages(formattedMessages)
                setSession(id)
            }
        } catch (err) {
            setError('Failed to load session')
        } finally {
            setLoading(false)
        }
    }, [setLoading, setSession, setMessages, setError])

    /**
     * Delete a session
     */
    const deleteSession = useCallback(async (id) => {
        if (!id) return

        // Optimistic update
        setSessions(prev => prev.filter(s => s.id !== id))

        // If deleting current session, clear it
        if (sessionId === id) {
            clearMessages()
            setSession(null)
        }

        const result = await deleteChatSession(id)
        if (!result.success) {
            // Revert on failure (simple refresh)
            refreshSessions()
            setError('Failed to delete chat')
        }
    }, [sessionId, setSessions, setSession, clearMessages, refreshSessions, setError])



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
        loadSession,
        sessions,
        refreshSessions,
        deleteSession,

    }
}

export default useChatActions
