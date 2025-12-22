import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    MessageSquare,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    MoreHorizontal,
    Trash2
} from 'lucide-react'
import Button from '@components/UI/Button'
import { useAuth } from '@context/AuthContext'
import useChatActions from '@hooks/useChat'
import { createChatSession } from '@services/api'
import { Link } from 'react-router-dom'
import SettingsModal from './SettingsModal'

const Sidebar = ({ isOpen, onToggle, onNewChat }) => {
    const { user, logout, isAuthenticated } = useAuth()
    const { loadSession, startNewConversation, sessions, refreshSessions, deleteSession, messages } = useChatActions()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            refreshSessions()
        }
    }, [isAuthenticated, refreshSessions])

    const handleNewChatClick = async () => {
        if (isAuthenticated) {
            const result = await createChatSession()
            if (result.success) {
                await refreshSessions()
                loadSession(result.data.id)
                if (window.innerWidth < 768) onToggle()
            }
        } else {
            startNewConversation()
            if (window.innerWidth < 768) onToggle()
        }
        if (onNewChat) onNewChat()
    }

    const handleSessionClick = (sessionId) => {
        loadSession(sessionId)
        if (window.innerWidth < 768) onToggle()
    }

    const handleLogout = () => {
        logout()
        startNewConversation()
    }

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={`
                    fixed md:relative z-50 h-full w-[280px] bg-black/95 border-r border-gold-500/10 flex flex-col
                    md:translate-x-0 transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header / New Chat */}
                <div className="p-4">
                    <Button
                        onClick={handleNewChatClick}
                        className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                        variant="ghost"
                    >
                        <Plus size={18} className="text-gold-500" />
                        <span className="font-medium">New Chat</span>
                    </Button>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-y-auto px-2 py-2 thin-scrollbar">
                    {!isAuthenticated ? (
                        <div className="text-center p-4 text-gray-500 text-sm">
                            <p className="mb-2">Login to save your chat history</p>
                            <Link to="/login" className="text-gold-500 hover:underline">Sign In</Link>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {sessions.length === 0 && (
                                <p className="text-gray-500 text-sm px-4">No history yet</p>
                            )}
                            {sessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => handleSessionClick(session.id)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group relative pr-8"
                                >
                                    <MessageSquare size={16} className="text-gray-500 group-hover:text-gold-500 transition-colors" />
                                    <span className="truncate">{session.title}</span>

                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteSession(session.id)
                                        }}
                                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400 transition-all"
                                        title="Delete Chat"
                                    >
                                        <Trash2 size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* User / Settings Footer */}
                <div className="p-4 border-t border-gold-500/10 bg-black/50">
                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left mb-1"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-xs">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate">{user?.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <Settings size={16} className="text-gray-500" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 p-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 text-gold-500 text-sm font-medium p-2 hover:bg-white/5 rounded-lg">
                            <User size={18} />
                            Sign In / Sign Up
                        </Link>
                    )}
                </div>
            </motion.aside>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                messages={messages}
                onClear={startNewConversation}
            />
        </>
    )
}

export default Sidebar
