module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deloitte-blue': '#002776',
        'deloitte-green': '#92d400',
        'deloitte-cyan': '#00a1de',
        'deloitte-black': '#000000',
        'deloitte-white': '#ffffff',
      },
    },
  },
  darkMode: 'class', // Add this line to enable class-based dark mode
  plugins: [],
};
