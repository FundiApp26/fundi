/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'fundi-green': '#53893D',
        'fundi-green-dark': '#2D5A27',
        'fundi-orange': '#DC8D00',
        'fundi-orange-light': '#FFCF78',
        'fundi-gray': '#F5F5F5',
        'fundi-dark': '#1A1A1A',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
        'candara': ['Candara', 'Calibri', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
