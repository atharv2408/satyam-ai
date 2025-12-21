import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft } from 'lucide-react'
import Sidebar from '@components/Chatbot/Sidebar'
import Chatbot from '@components/Chatbot/Chatbot'

const ChatPage = () => {
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleNewChat = () => {
        // Sidebar handles logic now
        setIsSidebarOpen(false)
    }

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(false)}
                onNewChat={handleNewChat}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative">

                {/* Top Mobile Header (Visible only on mobile/tablet) */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-gold-500/10 bg-black/95 backdrop-blur-xl z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-serif text-gold-500">SATYAM AI</span>
                    <div className="w-8" /> {/* Spacer */}
                </header>

                {/* Back to Home (Absolute, Desktop) */}
                <div className="absolute top-4 right-6 z-20 hidden md:block">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-400 hover:text-white transition-colors border border-white/5"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>
                </div>

                {/* The Chat Area */}
                <div className="flex-1 relative w-full h-full">
                    <Chatbot />
                </div>
            </main>
        </div>
    )
}

export default ChatPage
