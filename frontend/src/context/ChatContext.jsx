import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Initial state
const initialState = {
    messages: [
        {
            id: 'welcome',
            type: 'ai',
            content: `Namaste! 🙏 I am SATYAM AI, your legal assistant powered by Indian constitutional values.

I can help you with:
• Understanding Indian laws and rights
• Constitutional provisions
• Legal procedures and processes
• Case law references

How may I assist you today?`,
            timestamp: new Date().toISOString(),
        },
    ],
    sessionId: null,
    isLoading: false,
    error: null,
    settings: {
        language: 'en',
        mode: 'simple', // 'simple' or 'professional'
    },
    sessions: [],
}

// Action types
const ACTIONS = {
    ADD_MESSAGE: 'ADD_MESSAGE',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_SESSION: 'SET_SESSION',
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    CLEAR_MESSAGES: 'CLEAR_MESSAGES',
    UPDATE_MESSAGE: 'UPDATE_MESSAGE',
    SET_MESSAGES: 'SET_MESSAGES',
    SET_SESSIONS: 'SET_SESSIONS',
}

// Reducer
function chatReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }

        case ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            }

        case ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }

        case ACTIONS.SET_SESSION:
            return {
                ...state,
                sessionId: action.payload,
            }

        case ACTIONS.UPDATE_SETTINGS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload,
                },
            }

        case ACTIONS.CLEAR_MESSAGES:
            return {
                ...state,
                messages: [initialState.messages[0]],
            }

        case ACTIONS.UPDATE_MESSAGE:
            return {
                ...state,
                messages: state.messages.map((msg) =>
                    msg.id === action.payload.id
                        ? { ...msg, ...action.payload.updates }
                        : msg
                ),
            }

        case ACTIONS.SET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
            }

        case ACTIONS.SET_SESSIONS:
            return {
                ...state,
                sessions: action.payload,
            }

        default:
            return state
    }
}

// Create context
const ChatContext = createContext(null)

// Provider component
export function ChatProvider({ children }) {
    const [state, dispatch] = useReducer(chatReducer, initialState)

    // Add a user message
    const addUserMessage = useCallback((content) => {
        const message = {
            id: uuidv4(),
            type: 'user',
            content,
            timestamp: new Date().toISOString(),
        }
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: message })
        return message.id
    }, [])

    // Add an AI message
    const addAIMessage = useCallback((content, references = []) => {
        const message = {
            id: uuidv4(),
            type: 'ai',
            content,
            references,
            timestamp: new Date().toISOString(),
        }
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: message })
        return message.id
    }, [])

    // Set loading state
    const setLoading = useCallback((isLoading) => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading })
    }, [])

    // Set error
    const setError = useCallback((error) => {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error })
    }, [])

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_ERROR })
    }, [])

    // Set session ID
    const setSession = useCallback((sessionId) => {
        dispatch({ type: ACTIONS.SET_SESSION, payload: sessionId })
    }, [])

    // Update settings
    const updateSettings = useCallback((settings) => {
        dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settings })
    }, [])

    // Clear all messages
    const clearMessages = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_MESSAGES })
    }, [])

    // Update a specific message
    const updateMessage = useCallback((id, updates) => {
        dispatch({ type: ACTIONS.UPDATE_MESSAGE, payload: { id, updates } })
    }, [])

    // Set all messages (for loading history)
    const setMessages = useCallback((messages) => {
        dispatch({ type: ACTIONS.SET_MESSAGES, payload: messages })
    }, [])

    // Set sessions list
    const setSessions = useCallback((sessions) => {
        dispatch({ type: ACTIONS.SET_SESSIONS, payload: sessions })
    }, [])

    const value = {
        ...state,
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
        sessions: state.sessions,
        setSessions,
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

// Custom hook to use chat context
export function useChat() {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

export default ChatContext
