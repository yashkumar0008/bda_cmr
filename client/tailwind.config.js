/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dce7ff',
          200: '#b9d0ff',
          300: '#82adff',
          400: '#4c84ff',
          500: '#1a56ff',
          600: '#0038f5',
          700: '#0028d6',
          800: '#0021ae',
          900: '#001f8a',
        },
        slate: {
          850: '#111827',
          950: '#030712',
        }
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
