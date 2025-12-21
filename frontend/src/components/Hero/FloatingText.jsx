import React from 'react'
import { FLOATING_FRAGMENTS } from '@constants'

const FloatingText = () => {
    return (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
            {FLOATING_FRAGMENTS.map((fragment, index) => (
                <span
                    key={index}
                    className="absolute font-serif text-xs text-gold-500/15"
                    style={{
                        left: fragment.x,
                        top: fragment.y,
                        animation: `fragment-float 20s ease-in-out infinite`,
                        animationDelay: `${fragment.delay}s`,
                    }}
                >
                    {fragment.text}
                </span>
            ))}

            <style jsx>{`
        @keyframes fragment-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
            opacity: 0.25;
          }
        }
      `}</style>
        </div>
    )
}

export default FloatingText
