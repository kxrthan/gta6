/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './app/**/*.{js,jsx,mdx}',
    './content/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gta-pink': '#FF2E88',
        'gta-orange': '#FF8A3D',
        'gta-purple': '#7B2FF7',
        'gta-teal': '#00E5FF',
        'gta-dark': '#0B0B14',
        'gta-navy': '#0D0D1A',
        'gta-card': '#12121F',
        'gta-border': '#1E1E35',
      },
      fontFamily: {
        heading: ['var(--font-bebas)', 'Anton', 'Impact', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gta-gradient': 'linear-gradient(135deg, #FF2E88 0%, #FF8A3D 25%, #7B2FF7 70%, #00E5FF 100%)',
        'hero-gradient': 'linear-gradient(180deg, #0B0B14 0%, #1a0828 30%, #3d1060 55%, #c94040 75%, #ff8c42 90%, #ffd166 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(123,47,247,0.1) 0%, rgba(0,229,255,0.05) 100%)',
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255,46,136,0.5), 0 0 40px rgba(255,46,136,0.2)',
        'neon-teal': '0 0 20px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.2)',
        'neon-purple': '0 0 20px rgba(123,47,247,0.5), 0 0 40px rgba(123,47,247,0.2)',
        'neon-orange': '0 0 20px rgba(255,138,61,0.5), 0 0 40px rgba(255,138,61,0.2)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(123,47,247,0.2)',
      },
      animation: {
        'flicker': 'flicker 3s linear infinite',
        'glitch': 'glitch 0.5s ease-in-out',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'grid-move': 'grid-move 20s linear infinite',
        'star-pulse': 'star-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 1px)' },
          '40%': { transform: 'translate(3px, -1px)' },
          '60%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,46,136,0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255,46,136,0.9), 0 0 80px rgba(255,46,136,0.4)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'grid-move': {
          '0%': { transform: 'perspective(500px) rotateX(45deg) translateY(0)' },
          '100%': { transform: 'perspective(500px) rotateX(45deg) translateY(60px)' },
        },
        'star-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.7', filter: 'brightness(1.5)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
