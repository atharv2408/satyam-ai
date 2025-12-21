/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gold': {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#D4AF37',
                    600: '#B8860B',
                    700: '#92400E',
                    800: '#78350F',
                    900: '#451A03',
                },
                'charcoal': '#1a1a1a',
                'dark-navy': '#0d1117',
                'ivory': '#FFFFF0',
                'saffron': '#FF9933',
            },
            fontFamily: {
                'serif': ['Cinzel', 'Georgia', 'serif'],
                'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                'hindi': ['Noto Sans Devanagari', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
                'glow': 'glow 3s ease-in-out infinite',
                'typing': 'typing 1.4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0)' },
                    '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
                },
                glow: {
                    '0%, 100%': { opacity: 0.5 },
                    '50%': { opacity: 1 },
                },
                typing: {
                    '0%, 60%, 100%': { transform: 'translateY(0)' },
                    '30%': { transform: 'translateY(-8px)' },
                },
            },
            backgroundImage: {
                'gradient-gold': 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #FFD700 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%)',
            },
        },
    },
    plugins: [],
}
