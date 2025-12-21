import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hook for scroll-triggered animations
 * @param {object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to element
 */
export function useScrollAnimation(options = {}) {
    const elementRef = useRef(null)

    const {
        from = { opacity: 0, y: 50 },
        to = { opacity: 1, y: 0 },
        trigger = null,
        start = 'top 80%',
        end = 'top 50%',
        duration = 0.8,
        ease = 'power3.out',
        delay = 0,
        toggleActions = 'play none none reverse',
        scrub = false,
        markers = false,
    } = options

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const animation = gsap.fromTo(
            element,
            from,
            {
                ...to,
                duration,
                ease,
                delay,
                scrollTrigger: {
                    trigger: trigger || element,
                    start,
                    end,
                    toggleActions,
                    scrub,
                    markers,
                },
            }
        )

        return () => {
            animation.kill()
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [from, to, trigger, start, end, duration, ease, delay, toggleActions, scrub, markers])

    return elementRef
}

/**
 * Hook for staggered scroll animations
 * @param {object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to parent element
 */
export function useStaggerAnimation(options = {}) {
    const containerRef = useRef(null)

    const {
        childSelector = '> *',
        from = { opacity: 0, y: 30 },
        to = { opacity: 1, y: 0 },
        stagger = 0.1,
        duration = 0.6,
        ease = 'power2.out',
        start = 'top 85%',
    } = options

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const children = container.querySelectorAll(childSelector)

        const animation = gsap.fromTo(
            children,
            from,
            {
                ...to,
                duration,
                ease,
                stagger,
                scrollTrigger: {
                    trigger: container,
                    start,
                    toggleActions: 'play none none reverse',
                },
            }
        )

        return () => {
            animation.kill()
        }
    }, [childSelector, from, to, stagger, duration, ease, start])

    return containerRef
}

/**
 * Hook for parallax scroll effect
 * @param {number} speed - Parallax speed multiplier
 * @returns {React.RefObject} - Ref to attach to element
 */
export function useParallax(speed = 0.5) {
    const elementRef = useRef(null)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const animation = gsap.to(element, {
            y: () => speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        })

        return () => {
            animation.kill()
        }
    }, [speed])

    return elementRef
}

export default useScrollAnimation
