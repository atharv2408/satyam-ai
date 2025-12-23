import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, Square } from 'lucide-react'
import Button from '@components/UI/Button'
import useVoiceInput from '@hooks/useVoiceInput'

const ChatInput = ({ onSend, isLoading, onStop, value, onChange }) => {
    const textareaRef = useRef(null)
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        isSupported
    } = useVoiceInput()

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
        }
    }, [value])

    // Sync voice transcript with input value
    useEffect(() => {
        if (isListening && transcript) {
            onChange(transcript)
        }
    }, [transcript, isListening, onChange])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (value.trim() && !isLoading) {
            onSend(value)
            onChange('') // Clear parent state
            resetTranscript() // Clear voice transcript
            if (isListening) stopListening() // Stop recording
            // Reset height
            if (textareaRef.current) textareaRef.current.style.height = 'auto'
        }
    }

    const handleStop = (e) => {
        e.preventDefault()
        if (onStop) onStop()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const toggleVoiceInput = () => {
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className={`
                relative flex items-end gap-2 bg-white/5 border border-gold-500/20 rounded-2xl p-2 
                transition-all duration-300 shadow-lg shadow-black/50
                ${isLoading ? 'opacity-80' : 'focus-within:bg-black/80 focus-within:border-gold-500/50'}
                ${isListening ? 'border-red-500/50 bg-red-500/5' : ''}
            `}>

                {/* Attachment Button */}
                {/* Attachment Button Removed */}

                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        isListening
                            ? "Listening..."
                            : isLoading
                                ? "Satyam AI is thinking..."
                                : "Ask about your legal rights..."
                    }
                    disabled={isLoading}
                    className={`
                        flex-1 bg-transparent text-white placeholder-gray-500 text-[15px] resize-none focus:outline-none py-3 max-h-[150px] min-h-[44px]
                        ${isLoading ? 'cursor-not-allowed text-gray-400' : ''}
                    `}
                    rows={1}
                />

                {/* Voice Button */}
                {!isLoading && isSupported && (
                    <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`
                            p-3 rounded-xl transition-all duration-300 shrink-0
                            ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }
                        `}
                        title={isListening ? "Stop Recording" : "Start Voice Input"}
                    >
                        <Mic size={20} className={isListening ? "animate-bounce" : ""} />
                    </button>
                )}

                {/* Send / Stop Button */}
                {(value || isLoading) && (
                    <button
                        type={isLoading ? "button" : "submit"}
                        onClick={isLoading ? handleStop : undefined}
                        className={`
                            p-3 rounded-xl transition-all duration-300 shrink-0
                            ${isLoading
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:scale-105 shadow-lg shadow-gold-500/25'
                            }
                        `}
                    >
                        {isLoading ? (
                            <Square size={18} fill="currentColor" />
                        ) : (
                            <Send size={18} fill={value ? "currentColor" : "none"} />
                        )}
                    </button>
                )}
            </div>

            <p className="text-center text-[10px] text-gray-600 mt-3 select-none">
                Satyam AI can make mistakes. Consider checking important information.
            </p>
        </form>
    )
}

export default ChatInput
