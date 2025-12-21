import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for managing 3D emblem rotation based on scroll
 * @returns {object} - Rotation values and scroll progress
 */
export function useEmblemRotation() {
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [scrollProgress, setScrollProgress] = useState(0)

    const handleScroll = useCallback(() => {
        // Calculate global scroll progress (0 to 1) based on total scrollable height
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        const currentScroll = window.scrollY

        // Avoid division by zero
        const progress = totalHeight > 0 ? Math.max(0, Math.min(1, currentScroll / totalHeight)) : 0
        setScrollProgress(progress)

        // Calculate target rotation based on scroll
        // Rotate multiple times (e.g., 4 full rotations) over the course of the page
        const targetY = progress * Math.PI * 4
        const targetX = Math.sin(progress * Math.PI * 2) * 0.2 // Gentle bobbing

        setRotation({ x: targetX, y: targetY })
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial call

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    return {
        rotation,
        scrollProgress,
    }
}

export default useEmblemRotation
