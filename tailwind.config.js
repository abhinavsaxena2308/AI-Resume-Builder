/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        invertase: {
          bg: '#09090b',
          surface: 'rgba(255,255,255,0.03)',
          border: 'rgba(255,255,255,0.07)',
          'border-hover': 'rgba(212, 175, 55, 0.4)',
          accent: '#D4AF37',
          'accent-light': '#F9F295',
          'accent-glow': 'rgba(212, 175, 55, 0.25)',
          muted: '#a1a1aa',
          subtle: '#71717a',
        },
        gold: {
          50: '#fffdf0',
          100: '#fff8be',
          200: '#fff281',
          300: '#ffe441',
          400: '#ffd111',
          500: '#D4AF37',
          600: '#d18d00',
          700: '#a36300',
          800: '#854e00',
          900: '#704100',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'orb-1': 'orb1 20s ease-in-out infinite',
        'orb-2': 'orb2 25s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        orb1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(80px, -60px) scale(1.1)' },
          '66%': { transform: 'translate(-40px, 40px) scale(0.95)' },
        },
        orb2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-60px, 80px) scale(0.9)' },
          '66%': { transform: 'translate(60px, -40px) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};