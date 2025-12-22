import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestionChips from './SuggestionChips'
import useChatActions from '@hooks/useChat'

import ChatBackground3D from './ChatBackground3D'

const Chatbot = ({ onVisibilityChange }) => {
    const {
        messages,
        isLoading,
        error,
        sendMessage,
        sendMessageStreaming,
        startNewConversation,
        stopGeneration,
    } = useChatActions()

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const [inputValue, setInputValue] = React.useState('')

    const handleSend = async (text) => {
        // Use streaming for better UX
        await sendMessageStreaming(text, (chunk) => {
            // Chunk handling if we want to do something specific
            // The hook updates the state automatically, but we can access partials here
        })
    }

    // Suggestions shown only when chat is empty or just welcome message
    const showSuggestions = messages.length <= 1

    return (
        <div className="relative w-full h-full bg-gradient-to-b from-black to-charcoal/20 overflow-hidden">
            {/* Full Screen 3D Background */}
            <ChatBackground3D />

            {/* Content Container - Centered and Constrained */}
            <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative z-10 pointer-events-none">
                {/* Pointer events enabled only for interactive elements */}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 thin-scrollbar scroll-smooth pointer-events-auto">
                    {/* Spacer for Top Content */}
                    <div className="h-4" />

                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 mb-4 pointer-events-auto">
                    <div className="bg-black/80 backdrop-blur-lg border border-gold-500/10 rounded-2xl p-2 shadow-2xl">
                        <div className="space-y-4 p-2">
                            {showSuggestions && (
                                <div className="mb-2">
                                    <SuggestionChips onSuggestionClick={(text) => setInputValue(text)} />
                                </div>
                            )}

                            <ChatInput
                                onSend={handleSend}
                                isLoading={isLoading}
                                onStop={stopGeneration}
                                value={inputValue}
                                onChange={setInputValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatbot
