import React from 'react'
import { motion } from 'framer-motion'
import {
    Shield,
    CheckCircle,
    HelpCircle,
    Lock,
    Users,
    Clock
} from 'lucide-react'

const iconMap = {
    Shield,
    CheckCircle,
    HelpCircle,
    Lock,
    Users,
    Clock,
}

const FeatureCard = ({ feature, index }) => {
    const Icon = iconMap[feature.icon] || Shield

    const cardVariants = {
        hidden: { opacity: 0, y: 50, rotateX: -10 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
            },
        },
    }

    return (
        <motion.article
            className="feature-card group relative bg-white/[0.02] border border-gold-500/10 rounded-2xl p-8 cursor-pointer overflow-hidden transition-colors duration-300 hover:bg-gold-500/[0.03]"
            variants={cardVariants}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-gold-500/10 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

            {/* Icon */}
            <div className="w-16 h-16 mb-6 relative z-10">
                <motion.div
                    className="w-full h-full rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/20"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Icon size={28} className="text-black" />
                </motion.div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl text-white mb-3 group-hover:text-gold-400 transition-colors duration-300 relative z-10">
                {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                {feature.description}
            </p>

            {/* Highlights */}
            <ul className="space-y-2 relative z-10">
                {feature.highlights.map((highlight, i) => (
                    <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-white transition-colors"
                    >
                        <span className="text-gold-500 font-bold shadow-gold-glow">✓</span>
                        {highlight}
                    </li>
                ))}
            </ul>
        </motion.article>
    )
}

export default FeatureCard
