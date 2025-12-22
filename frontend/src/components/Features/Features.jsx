import React from 'react'
import { motion } from 'framer-motion'
import FeatureCard from './FeatureCard'
import { FEATURES } from '@constants'

const Features = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    // Calculate pentagon positions
    const getPosition = (index, total) => {
        const angle = (index * (360 / total) - 90) * (Math.PI / 180)
        const radius = 500 // Increased radius for better separation
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        return { x, y }
    }

    return (
        <section id="features" className="w-full min-h-[140vh] py-24 flex flex-col justify-center items-center px-6 shrink-0 border-t border-white/5 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />

            {/* Section Header */}
            <div className="text-center mb-52 relative z-10">
                <motion.span
                    className="inline-block px-4 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-xs font-semibold text-gold-500 tracking-wider uppercase mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Core Capabilities
                </motion.span>
                <motion.h2
                    className="font-serif text-3xl md:text-5xl text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    The Architecture of Justice
                </motion.h2>
                <motion.p
                    className="text-gray-400 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    A balanced ecosystem of 5 core pillars designed for legal truth.
                </motion.p>
            </div>

            {/* Desktop Radial Layout (Hidden on mobile) */}
            <div className="hidden lg:flex relative w-[1200px] h-[1200px] items-center justify-center">
                {/* Central Core */}
                <motion.div
                    className="absolute z-10 w-32 h-32 rounded-full border border-gold-500/30 bg-gold-900/10 backdrop-blur-md flex items-center justify-center shadow-gold-glow"
                    animate={{ boxShadow: ['0 0 20px rgba(212,175,55,0.2)', '0 0 50px rgba(212,175,55,0.4)', '0 0 20px rgba(212,175,55,0.2)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <div className="text-4xl">⚖️</div>
                    <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-ping-slow" />
                </motion.div>

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(212,175,55,0)" />
                            <stop offset="50%" stopColor="rgba(212,175,55,0.4)" />
                            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
                        </linearGradient>
                    </defs>
                    {/* Radial Lines from Center */}
                    {FEATURES.map((_, index) => {
                        const pos = getPosition(index, FEATURES.length)
                        return (
                            <motion.line
                                key={`line-${index}`}
                                x1="600"
                                y1="600"
                                x2={600 + pos.x}
                                y2={600 + pos.y}
                                stroke="url(#gold-gradient)"
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        )
                    })}
                    {/* Pentagon Ring Connections */}
                    {FEATURES.map((_, index) => {
                        const curr = getPosition(index, FEATURES.length)
                        const next = getPosition((index + 1) % FEATURES.length, FEATURES.length)
                        return (
                            <motion.line
                                key={`ring-${index}`}
                                x1={600 + curr.x}
                                y1={600 + curr.y}
                                x2={600 + next.x}
                                y2={600 + next.y}
                                stroke="rgba(212,175,55,0.15)"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 2, delay: 1 }}
                            />
                        )
                    })}
                </svg>

                {/* Orbiting Cards */}
                {FEATURES.map((feature, index) => {
                    const pos = getPosition(index, FEATURES.length)
                    return (
                        <motion.div
                            key={feature.id}
                            className="absolute w-[320px]"
                            style={{
                                left: `calc(50% + ${pos.x}px)`,
                                top: `calc(50% + ${pos.y}px)`,
                                x: '-50%',
                                y: '-50%'
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, type: 'spring', stiffness: 50 }}
                            viewport={{ once: true }}
                        >
                            <FeatureCard feature={feature} index={index} />
                        </motion.div>
                    )
                })}
            </div>

            {/* Mobile/Tablet Stack Layout */}
            <div className="lg:hidden flex flex-col gap-6 w-full max-w-md">
                {FEATURES.map((feature, index) => (
                    <FeatureCard key={feature.id} feature={feature} index={index} />
                ))}
            </div>
        </section>
    )
}

export default Features
