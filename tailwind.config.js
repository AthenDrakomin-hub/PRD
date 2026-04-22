/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        dark: {
          bg: '#0D1117',
          card: '#161B22',
          border: '#30363D',
        },
        cyber: {
          accent: '#00E5FF',
          hover: '#00B8CC',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00E5FF, 0 0 10px #00E5FF' },
          '100%': { boxShadow: '0 0 10px #00E5FF, 0 0 20px #00E5FF' },
        }
      }
    },
  },
  plugins: [],
};
