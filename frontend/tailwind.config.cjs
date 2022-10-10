/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        feedPost: ""
      },
      height: {
        feedPost: "24rem"
      }
    },
  },
  plugins: [],
};
