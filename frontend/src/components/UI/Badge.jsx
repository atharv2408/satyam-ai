import React from 'react'
import { motion } from 'framer-motion'

const Badge = ({ icon, text }) => {
    return (
        <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full"
            animate={{
                boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0)',
                    '0 0 20px rgba(212, 175, 55, 0.3)',
                    '0 0 20px rgba(212, 175, 55, 0)',
                ],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
            }}
        >
            {icon && <span className="text-base">{icon}</span>}
            <span className="text-xs font-semibold text-gold-500 tracking-wider uppercase">
                {text}
            </span>
        </motion.div>
    )
}

export default Badge
