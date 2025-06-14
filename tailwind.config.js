// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Noto Sans JP"', 'sans-serif'],
          display: ['"Playfair Display"', 'serif'],
        },
      },
    },
    plugins: [],
  }
  