import React from 'react'
import { motion } from 'framer-motion'

const LegalLoading = () => {
    return (
        <motion.div
            className="flex gap-3 max-w-[90%]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Premium Loading Bubble */}
            <div className="bg-charcoal/80 border border-gold-500/20 rounded-xl p-4 shadow-[0_0_15px_rgba(234,179,8,0.1)] backdrop-blur-sm">
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-gold-500 rounded-full"
                            animate={{
                                y: [0, -8, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default LegalLoading
