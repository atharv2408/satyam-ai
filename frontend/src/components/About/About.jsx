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
        <section id="about" className="w-full h-screen flex flex-col justify-center items-center px-6 bg-charcoal/90 shrink-0 border-t border-white/5">
            <div className="max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-xs font-semibold text-gold-500 tracking-wider uppercase mb-4">
                            Our Mission
                        </span>

                        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                            Democratizing Legal Knowledge
                        </h2>

                        <p className="text-gray-400 leading-relaxed mb-4">
                            SATYAM AI is born from the principle of{' '}
                            <strong className="text-gold-500">सत्यमेव जयते</strong> — Truth Alone
                            Triumphs. We believe every citizen of India deserves access to
                            accurate, understandable legal information.
                        </p>

                        <p className="text-gray-400 leading-relaxed mb-8">
                            Our AI is trained on the Constitution of India, landmark Supreme
                            Court judgments, and verified legal sources to provide you with
                            trustworthy guidance rooted in the foundations of Indian democracy.
                        </p>

                        {/* Values */}
                        <div className="space-y-4">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    className="flex gap-4 p-4 bg-gold-500/5 rounded-xl border border-gold-500/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-2xl">
                                        {index === 0 ? '🏛️' : index === 1 ? '⚖️' : '🔒'}
                                    </span>
                                    <div>
                                        <h4 className="font-serif text-white mb-1">{value.title}</h4>
                                        <p className="text-sm text-gray-500">{value.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual - Constitution Book */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, x: 50, rotateY: 20 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="constitution-book relative w-[280px] h-[380px]">
                            <div className="book-cover absolute w-full h-full rounded-r-2xl flex items-center justify-center">
                                <div className="text-center p-8 border-2 border-gold-500 rounded-lg">
                                    <span className="block font-hindi text-xl text-gold-500 mb-2">
                                        भारत का संविधान
                                    </span>
                                    <span className="block font-serif text-sm text-gold-500 tracking-wider">
                                        Constitution of India
                                    </span>
                                </div>
                            </div>
                            <div className="book-spine absolute left-[-20px] top-0 w-5 h-full rounded-l-sm" />
                            <div className="book-pages absolute right-1 top-1 w-[95%] h-[calc(100%-8px)] rounded-r-lg -z-10" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About
