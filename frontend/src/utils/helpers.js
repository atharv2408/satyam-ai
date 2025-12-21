/**
 * Format a message by highlighting legal references
 * @param {string} content - The message content
 * @returns {string} - Formatted HTML string
 */
export function formatLegalMessage(content) {
    if (!content) return ''

    return content
        .replace(/Article \d+(\([a-z]\))?/gi, '<span class="legal-ref">$&</span>')
        .replace(/Section \d+(\([a-z]\))?/gi, '<span class="legal-ref">$&</span>')
        .replace(/\b(IPC|CrPC|CPC|RTI|POCSO|IT Act|BNS|BNSS)\b/gi, '<span class="legal-ref">$&</span>')
        .replace(/\b(Supreme Court|High Court|District Court)\b/gi, '<span class="legal-ref">$&</span>')
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format timestamp to readable time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted time string
 */
export function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {function} - Throttled function
 */
export function throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * Animate counting up to a number
 * @param {HTMLElement} element - Element to update
 * @param {number} target - Target number
 * @param {number} duration - Duration in ms
 */
export function animateCounter(element, target, duration = 2000) {
    const step = target / (duration / 16)
    let current = 0

    const updateCounter = () => {
        current += step
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString()
            requestAnimationFrame(updateCounter)
        } else {
            element.textContent = target.toLocaleString()
        }
    }

    updateCounter()
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset percentage (0-1)
 * @returns {boolean}
 */
export function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight

    return (
        rect.top <= viewportHeight * (1 - offset) &&
        rect.bottom >= viewportHeight * offset
    )
}

/**
 * Smooth scroll to element
 * @param {string} elementId - Element ID to scroll to
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        console.error('Failed to copy:', err)
        return false
    }
}

/**
 * Clamp a number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Progress (0-1)
 * @returns {number}
 */
export function lerp(start, end, t) {
    return start + (end - start) * t
}
