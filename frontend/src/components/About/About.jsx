import React from 'react'
import { motion } from 'framer-motion'
import { Building, Scale, Lock } from 'lucide-react'

const About = () => {
    const values = [
        {
            icon: Building,
            title: 'Constitutional Foundation',
            description: 'Grounded in the principles of the Indian Constitution',
        },
        {
            icon: Scale,
            title: 'Impartial Justice',
            description: 'Unbiased information for all, regardless of background',
        },
        {
            icon: Lock,
            title: 'Privacy Protected',
            description: 'Your queries remain confidential and secure',
        },
    ]

    return (
        <section id="about" className="w-full h-screen flex flex-col justify-center items-center px-6 bg-transparent shrink-0 border-t border-white/5">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex flex-col items-center text-center">
                    {/* Content */}
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-xs font-semibold text-gold-500 tracking-wider uppercase mb-4">
                            Our Mission
                        </span>

                        <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
                            Democratizing Legal Knowledge
                        </h2>

                        <p className="text-gray-400 leading-relaxed mb-4 text-lg">
                            SATYAM AI is born from the principle of{' '}
                            <strong className="text-gold-500">सत्यमेव जयते</strong> — Truth Alone
                            Triumphs. We believe every citizen of India deserves access to
                            accurate, understandable legal information.
                        </p>

                        <p className="text-gray-400 leading-relaxed mb-12 text-lg">
                            Our AI is trained on the Constitution of India, landmark Supreme
                            Court judgments, and verified legal sources to provide you with
                            trustworthy guidance rooted in the foundations of Indian democracy.
                        </p>

                        {/* Values - Transformed to horizontal grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    className="flex flex-col gap-3 p-6 bg-gold-500/5 rounded-xl border border-gold-500/10 hover:bg-gold-500/10 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                >
                                    <span className="text-3xl mb-2">
                                        {index === 0 ? '🏛️' : index === 1 ? '⚖️' : '🔒'}
                                    </span>
                                    <div>
                                        <h4 className="font-serif text-lg text-white mb-2">{value.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About
