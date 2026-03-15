/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/components/**/*.{js,jsx}',
        './src/pages/**/*.{js,jsx}',
        './src/main.jsx',
        './src/App.jsx',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00E5E5',
                secondary: '#008B8B',
                accent: '#5DFDFD',
                turquoise: '#00CED1',
                background: '#000000',
                'white-text': '#FFFFFF',
            },
            fontFamily: {
                sans: ['Work Sans', 'Inter', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
                alpha: ['AlphaCentauri', 'Orbitron', 'Impact', 'sans-serif'],
            },
            borderRadius: {
                'xl-sm': '2px',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                'logo-glow-opacity': {
                    '0%, 100%': { opacity: '0' },
                    '50%': { opacity: '1' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'intro-fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'intro-fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                },
                'stars-appear': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'logo-appear': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                'content-appear': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            },
            animation: {
                shimmer: 'shimmer 2s infinite',
                'logo-glow-opacity': 'logo-glow-opacity 6s ease-in-out infinite',
                'fade-in': 'fade-in 1.5s ease-out forwards',
                'intro-fade-in': 'intro-fade-in 1.5s ease-out forwards',
                'intro-fade-out': 'intro-fade-out 1.5s ease-out forwards',
                'stars-appear': 'stars-appear 2s ease-out forwards',
                'logo-appear': 'logo-appear 2s ease-out forwards',
                'content-appear': 'content-appear 1.5s ease-out forwards'
            }
        },
    },
    plugins: [],
};