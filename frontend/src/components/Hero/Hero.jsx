import React from 'react'
import { motion } from 'framer-motion'
import Button from '@components/UI/Button'
import Badge from '@components/UI/Badge'
import { APP_CONFIG } from '@constants'

const Hero = ({ onStartChat }) => {
    // Variants simplified for direct entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    }

    return (
        <section id="hero" className="hero w-full h-screen flex items-center justify-center relative overflow-hidden shrink-0">
            {/* Hero Content */}
            <motion.div
                className="relative z-10 text-center max-w-4xl px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                    <Badge icon="🏛️" text="AI-Powered Legal Intelligence" />
                </motion.div>

                {/* Title */}
                <motion.h1 variants={itemVariants} className="mt-8 mb-4">
                    <span className="hero-title block font-serif text-5xl md:text-7xl font-bold tracking-wider">
                        {APP_CONFIG.NAME}
                    </span>
                    <span className="block font-hindi text-2xl md:text-3xl text-gold-600 mt-2 opacity-80">
                        सत्यम् ऐआई
                    </span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    variants={itemVariants}
                    className="font-serif text-lg md:text-xl text-gold-500 tracking-[0.3em] uppercase mb-8"
                >
                    {APP_CONFIG.TAGLINE}
                </motion.p>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    {APP_CONFIG.DESCRIPTION}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                >
                    <Button onClick={onStartChat} size="lg" icon="⚖️">
                        Start Legal Chat
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        icon="📜"
                        onClick={() => {
                            // Scroll logic might need adjustment for horizontal, but keeping for now
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                    >
                        Explore Features
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero
