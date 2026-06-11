/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand greens
        forest:    { DEFAULT: '#3B5E41', light: '#4D7A54', dark: '#2C4731' },
        sage:      { DEFAULT: '#6B8F71', light: '#859FA8', dark: '#506B56' },
        olive:     { DEFAULT: '#8C9E5A', light: '#A3B470', dark: '#6E7E42' },

        // Warm neutrals
        cream:     { DEFAULT: '#FAF7F0', dark: '#EDE8DC' },
        parchment: { DEFAULT: '#EDE8DC', dark: '#E0D9C8' },
        linen:     { DEFAULT: '#F5F1E8', dark: '#EAE4D6' },
        stone:     { DEFAULT: '#E5E0D4', dark: '#CCC7B8' },
        sand:      { DEFAULT: '#D4CFC0', dark: '#BDB7A6' },

        // Text tones
        earth:     { DEFAULT: '#1E1E1B', light: '#2E2E2A' },
        bark:      { DEFAULT: '#4A4540', light: '#6A635C' },
        mist:      { DEFAULT: '#6B6560', light: '#8A837B' },  // darkened for WCAG 4.5:1

        // Accent / highlight
        clay:      { DEFAULT: '#C06B40', light: '#D07E55', dark: '#9A5430' },
        brown:     { DEFAULT: '#502814', light: '#6B3A1E', dark: '#3A1C0E' },
        moss:      { DEFAULT: '#4A6741', light: '#5C7D52', dark: '#374F30' },

        // Warm amber — used for star ratings
        honey:     { DEFAULT: '#B8882A', light: '#CC9E40', dark: '#96701E' },
      },
      fontFamily: {
        sans:    ['"Secular One"', 'Heebo', 'system-ui', 'sans-serif'],
        serif:   ['Fraunces', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['Fraunces', 'system-ui', 'serif'],
        body:    ['Heebo', 'system-ui', 'sans-serif'],
        mono:    ['"Roboto Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)',   { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem,   4vw, 3rem)',   { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)',{ lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.25rem,2vw, 1.75rem)',{ lineHeight: '1.3' }],
      },
      spacing: {
        section: '7rem',
        'section-sm': '4rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(90,60,30,0.07), 0 4px 16px rgba(90,60,30,0.05)',
        'card-hover': '0 4px 12px rgba(90,60,30,0.11), 0 12px 32px rgba(90,60,30,0.08)',
        'cta':        '0 8px 32px rgba(59,94,65,0.28)',
        'input':      '0 0 0 3px rgba(107,143,113,0.22)',
        'warm-sm':    '0 2px 8px rgba(90,60,30,0.09)',
      },
      animation: {
        // Strong ease-out (cubic-bezier(0.23,1,0.32,1)) — immediate movement, clean landing
        'fade-up':   'fadeUp 280ms cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-in':   'fadeIn 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'slide-in':  'slideIn 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'pulse-soft':'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        // 10px travel (not 20px) — snappier, less theatrical
        fadeUp:    { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:   { from: { opacity: 0, transform: 'translateX(10px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      },
      backgroundImage: {
        'gradient-radial':     'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':       'linear-gradient(to left, rgba(30,30,27,0.0) 0%, rgba(30,30,27,0.55) 50%, rgba(30,30,27,0.85) 100%)',
        'section-gradient':    'linear-gradient(180deg, #FAF7F0 0%, #EDE8DC 100%)',
        'green-gradient':      'linear-gradient(135deg, #3B5E41 0%, #4D7A54 100%)',
      },
    },
  },
  plugins: [],
}
