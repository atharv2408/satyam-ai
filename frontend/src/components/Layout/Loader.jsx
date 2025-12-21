import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
    return (
        <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-[500]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center">
                {/* Animated Emblem */}
                <div className="w-24 h-24 mx-auto mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#D4AF37"
                            strokeWidth="2"
                            strokeDasharray="283"
                            strokeDashoffset="75"
                            strokeLinecap="round"
                            className="animate-loader-dash"
                        />
                    </svg>
                </div>

                {/* Sanskrit Text */}
                <motion.p
                    className="font-hindi text-2xl text-gold-500 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    सत्यमेव जयते
                </motion.p>

                {/* Loading Text */}
                <motion.p
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Initializing SATYAM AI...
                </motion.p>
            </div>

            <style jsx>{`
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        @keyframes loader-dash {
          0% { stroke-dashoffset: 283; }
          50% { stroke-dashoffset: 75; }
          100% { stroke-dashoffset: 283; }
        }
        .animate-loader-dash {
          animation: loader-dash 1.5s ease-in-out infinite;
        }
      `}</style>
        </motion.div>
    )
}

export default Loader
