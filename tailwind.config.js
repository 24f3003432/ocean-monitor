/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#030b14',
          900: '#071526',
          800: '#0e2540',
          700: '#153a63',
          600: '#1e528a',
          500: '#2b73b8',
          400: '#4897e0',
          300: '#75b5ec',
          200: '#a8d2f5',
          100: '#dbeafe',
        },
        plastic: {
          nurdle: '#f59e0b',
          container: '#ef4444',
          sheet: '#ec4899',
          gear: '#8b5cf6',
          clean: '#10b981'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.2)' },
        },
        drift: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
