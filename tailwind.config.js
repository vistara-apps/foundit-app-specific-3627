/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(202, 83%, 41%)',
        'primary-hover': 'hsl(202, 83%, 35%)',
        accent: 'hsl(32, 95%, 55%)',
        success: 'hsl(142, 71%, 45%)',
        warning: 'hsl(38, 92%, 50%)',
        danger: 'hsl(0, 84%, 60%)',
        bg: 'hsl(0, 0%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        'surface-hover': 'hsl(210, 20%, 97%)',
        border: 'hsl(214, 15%, 88%)',
        'text-primary': 'hsl(222, 47%, 11%)',
        'text-secondary': 'hsl(215, 14%, 34%)',
        'text-muted': 'hsl(216, 12%, 54%)',
      },
      boxShadow: {
        'card': '0 2px 8px hsla(222, 47%, 11%, 0.08)',
        'card-hover': '0 8px 24px hsla(222, 47%, 11%, 0.12)',
        'modal': '0 20px 60px hsla(222, 47%, 11%, 0.25)',
        'button': '0 1px 3px hsla(222, 47%, 11%, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}