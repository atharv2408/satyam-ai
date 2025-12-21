import React from 'react'
import { motion } from 'framer-motion'
import { User, Copy, Info } from 'lucide-react'
import { copyToClipboard, formatTime } from '@utils/helpers'

const ChatMessage = ({ message }) => {
    const isAi = message.type === 'ai'

    const handleCopy = () => {
        copyToClipboard(message.content)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full gap-4 ${isAi ? 'justify-start' : 'justify-end'}`}
        >
            {/* AI Avatar */}
            {isAi && (
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-gold-400 to-gold-600 p-[1px] shadow-lg shadow-gold-500/20">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <span className="text-sm">⚖️</span>
                    </div>
                </div>
            )}

            {/* Message Bubble */}
            <div className={`relative max-w-[85%] md:max-w-[75%] group`}>

                {/* Header Name */}
                <span className={`text-xs text-gray-500 mb-1 block ${isAi ? 'text-left ml-1' : 'text-right mr-1'}`}>
                    {isAi ? 'Satyam AI' : 'You'}
                </span>

                <div
                    className={`
                        p-4 md:p-5 rounded-2xl leading-relaxed text-[15px] md:text-base border backdrop-blur-sm
                        ${isAi
                            ? 'bg-white/[0.03] border-white/10 text-gray-100 rounded-tl-sm shadow-sm'
                            : 'bg-gold-500/10 border-gold-500/20 text-white rounded-tr-sm shadow-md shadow-gold-500/5'
                        }
                    `}
                >
                    {message.content ? (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                        /* Thinking Animation (Dots) */
                        <div className="flex gap-1 py-1 px-1">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="w-1.5 h-1.5 bg-gold-500 rounded-full"
                                    animate={{
                                        y: [0, -6, 0],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions / Metadata */}
                <div className={`flex items-center gap-2 mt-1 px-1 ${isAi ? 'justify-start' : 'justify-end'}`}>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                        {formatTime(message.timestamp)}
                    </span>
                    {isAi && (
                        <button
                            onClick={handleCopy}
                            className="p-1 text-gray-600 hover:text-gold-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy to clipboard"
                        >
                            <Copy size={12} />
                        </button>
                    )}
                </div>

                {/* References (Citations) */}
                {isAi && message.references && message.references.length > 0 && (
                    <div className="mt-6 pl-2 border-l-2 border-gold-500/30">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Info size={12} /> Sources Verified
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {message.references.map((ref, idx) => (
                                <a
                                    key={idx}
                                    href={ref.url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs bg-black/40 border border-gold-500/20 text-gold-500/80 px-2 py-1 rounded hover:bg-gold-500/5 transition-colors"
                                >
                                    {ref.title || ref}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* User Avatar */}
            {!isAi && (
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-800 border border-gray-700 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-gray-400">
                        <User size={18} />
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default ChatMessage
