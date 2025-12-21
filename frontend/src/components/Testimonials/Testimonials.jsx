import React from 'react'
import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@constants'

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 px-6 bg-black">
            {/* Section Header */}
            <div className="text-center mb-16">
                <motion.span
                    className="inline-block px-4 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-xs font-semibold text-gold-500 tracking-wider uppercase mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Trusted By
                </motion.span>
                <motion.h2
                    className="font-serif text-3xl md:text-4xl text-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    What People Say
                </motion.h2>
            </div>

            {/* Testimonials Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TESTIMONIALS.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        className="bg-white/[0.02] border border-gold-500/10 rounded-2xl p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, borderColor: 'rgba(212, 175, 55, 0.3)' }}
                    >
                        {/* Quote */}
                        <div className="mb-6">
                            <p className="text-gray-300 italic leading-relaxed relative pl-6">
                                <span className="absolute left-0 top-[-10px] font-serif text-4xl text-gold-500/30">
                                    "
                                </span>
                                {testimonial.content}
                            </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-400 rounded-full flex items-center justify-center font-semibold text-black">
                                {testimonial.initials}
                            </div>
                            <div>
                                <h4 className="text-white">{testimonial.author}</h4>
                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Testimonials
