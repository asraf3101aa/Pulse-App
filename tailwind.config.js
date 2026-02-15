/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pulse: {
          ultramarineBlue: '#4169E1',
          desertStorm: '#f6f7f8',
          night: '#0a0a0c',
          muted: '#94a3b8',
          dusk: '#415771'
        },


      },
    },
  },

  plugins: [],
};
