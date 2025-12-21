import React, { useEffect, useRef } from 'react'

const Particles = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const particleCount = 50

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div')

            const size = Math.random() * 4 + 1
            const x = Math.random() * 100
            const y = Math.random() * 100
            const duration = Math.random() * 20 + 15
            const delay = Math.random() * -20
            const opacity = Math.random() * 0.5 + 0.1

            particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(212, 175, 55, ${opacity}) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: particle-float ${duration}s ease-in-out ${delay}s infinite;
      `

            container.appendChild(particle)
        }

        return () => {
            while (container.firstChild) {
                container.removeChild(container.firstChild)
            }
        }
    }, [])

    return (
        <>
            <div ref={containerRef} className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" />
            <style jsx global>{`
        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30vh) translateX(10vw) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-60vh) translateX(-5vw) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30vh) translateX(-10vw) scale(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
        </>
    )
}

export default Particles
