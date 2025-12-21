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

    return (
        <section id="features" className="w-full min-h-screen h-auto py-24 flex flex-col justify-center items-center px-6 bg-black/50 backdrop-blur-sm shrink-0 border-t border-white/5">
            {/* Section Header */}
            <div className="text-center mb-10">
                <motion.span
                    className="inline-block px-4 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-xs font-semibold text-gold-500 tracking-wider uppercase mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Core Capabilities
                </motion.span>
                <motion.h2
                    className="font-serif text-3xl md:text-4xl text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    Powerful Legal Intelligence
                </motion.h2>
                <motion.p
                    className="text-gray-400 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Built with precision, powered by constitutional values
                </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {FEATURES.map((feature, index) => (
                    <FeatureCard key={feature.id} feature={feature} index={index} />
                ))}
            </motion.div>
        </section>
    )
}

export default Features
