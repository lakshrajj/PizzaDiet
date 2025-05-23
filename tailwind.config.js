/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#121212',
          secondary: '#1E1E1E',
          accent: '#2D2D2D',
          text: '#F5F5F5',
          purple: '#9333EA',
          blue: '#3B82F6',
          teal: '#14B8A6',
          pink: '#EC4899',
          orange: '#F97316',
          red: '#EF4444'
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'bounce-delayed': 'bounce-delayed 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'sway': 'sway 12s ease-in-out infinite',
        'blob': 'blob 15s ease-in-out infinite',
        'drift': 'drift 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'bounce-delayed': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'slide-in': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' }
        },
        'sway': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        'blob': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '33%': { transform: 'scale(1.1) translate(30px, -50px)' },
          '66%': { transform: 'scale(0.9) translate(-20px, 20px)' },
          '100%': { transform: 'scale(1) translate(0, 0)' }
        },
        'drift': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(100px, 50px)' },
          '50%': { transform: 'translate(0, 100px)' },
          '75%': { transform: 'translate(-100px, 50px)' },
          '100%': { transform: 'translate(0, 0)' }
        }
      }
    },
  },
  plugins: [],
}
