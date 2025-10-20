/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,jsx,js}'
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f5f4ff',
          100: '#ebe9ff',
          200: '#d7d2ff',
          300: '#b6afff',
          400: '#9a90ff',
          500: '#6c5ce7',
          600: '#4f3fd3',
          700: '#3a2db0',
          800: '#2f258d',
          900: '#261f71'
        },
        nebula: '#0D1028',
        night: '#07071B',
        starlight: '#C8E4FF',
        aurora: '#F8D16C'
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif']
      },
      boxShadow: {
        glow: '0 0 30px rgba(108,92,231,0.45)',
        glass: '0 20px 60px rgba(7,7,27,0.45)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 20% 20%, rgba(108,92,231,0.55), transparent 55%), radial-gradient(circle at 80% 10%, rgba(200,228,255,0.35), transparent 45%), linear-gradient(135deg, rgba(7,7,27,1), rgba(13,16,40,0.95))'
      }
    }
  },
  plugins: []
}

