/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050508',
          900: '#08080d',
          850: '#0d0e15',
          800: '#12141f',
          700: '#1a1d2d',
          600: '#262a40',
        },
        gold: {
          100: '#fdf8ea',
          200: '#faecc2',
          300: '#f4d88e',
          400: '#e5c064',
          500: '#d4af37',
          600: '#b89228',
          700: '#8e6f1c',
        },
        brand: {
          cyan: '#38bdf8',
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'luxury-radial': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), rgba(56, 189, 248, 0.08) 40%, rgba(8, 8, 13, 0) 70%)',
        'gold-shimmer': 'linear-gradient(110deg, #d4af37 0%, #faecc2 25%, #d4af37 50%, #8e6f1c 75%, #d4af37 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        }
      }
    },
  },
  plugins: [],
};
