import React from 'react'
import { motion } from 'framer-motion'
import { CHAT_SUGGESTIONS } from '@constants'

const SuggestionChips = ({ onSuggestionClick }) => {
    return (
        <div className="flex flex-wrap gap-2 px-4 pb-4">
            {CHAT_SUGGESTIONS.map((suggestion, index) => (
                <motion.button
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-sm text-gold-500 hover:bg-gold-500/20 hover:border-gold-500 transition-all hover:-translate-y-0.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    {suggestion}
                </motion.button>
            ))}
        </div>
    )
}

export default SuggestionChips
