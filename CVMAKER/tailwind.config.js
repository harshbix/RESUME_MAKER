/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.35)',
        glow: '0 0 0 1px rgba(148, 163, 184, 0.2), 0 10px 25px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'paper-texture':
          'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.96) 100%), repeating-linear-gradient(45deg, rgba(148,163,184,0.08), rgba(148,163,184,0.08) 2px, transparent 2px, transparent 6px)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
