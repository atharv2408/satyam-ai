import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingChatButton = ({ onClick, isHidden }) => {
    return (
        <AnimatePresence>
            {!isHidden && (
                <motion.button
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-400 rounded-full flex items-center justify-center z-[200] shadow-lg shadow-gold-500/30"
                    onClick={onClick}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Open chat"
                >
                    <span className="text-2xl">💬</span>

                    {/* Pulse Ring */}
                    <span className="absolute w-full h-full rounded-full bg-gold-500 animate-ping opacity-20" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default FloatingChatButton
