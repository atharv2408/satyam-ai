import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    onClick,
    disabled = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all relative overflow-hidden'

    const variantClasses = {
        primary: 'bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:shadow-lg hover:shadow-gold-500/30',
        secondary: 'bg-transparent text-gold-500 border-2 border-gold-600 hover:bg-gold-500/10 hover:border-gold-500',
    }

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            {...props}
        >
            {icon && <span>{icon}</span>}
            <span>{children}</span>

            {/* Shine effect for primary variant */}
            {variant === 'primary' && (
                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-500 group-hover:left-[100%]" />
            )}
        </motion.button>
    )
}

export default Button
