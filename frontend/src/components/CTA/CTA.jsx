import React from 'react'
import { motion } from 'framer-motion'
import Button from '@components/UI/Button'

const CTA = ({ onStartChat }) => {
    return (
        <section className="w-full h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-r from-black to-charcoal shrink-0 border-t border-white/5 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-gold-500/10 rounded-full"
                        style={{
                            width: i * 150 + 100,
                            height: i * 150 + 100,
                            top: i === 1 ? '-100px' : i === 2 ? '50%' : 'auto',
                            bottom: i === 3 ? '-150px' : 'auto',
                            left: i === 1 ? '-100px' : 'auto',
                            right: i === 2 ? '10%' : i === 3 ? '-150px' : 'auto',
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            delay: i * 5,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <motion.h2
                    className="font-serif text-3xl md:text-4xl text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Ready to Get Legal Clarity?
                </motion.h2>

                <motion.p
                    className="text-lg text-gray-400 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    Join thousands of Indians who trust SATYAM AI for accurate,
                    constitutionally-grounded legal information.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={onStartChat} size="lg" icon="⚖️">
                        Start Free Consultation
                    </Button>
                    <Button variant="secondary" size="lg" icon="📞">
                        Contact Us
                    </Button>
                </motion.div>

                <motion.p
                    className="text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    No registration required • Completely free • Privacy protected
                </motion.p>
            </div>
        </section>
    )
}

export default CTA
