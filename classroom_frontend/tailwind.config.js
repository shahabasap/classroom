/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important:"#root",
  theme: {
    extend: {
      screens:{
        'xs':'375px'
      },
      colors:{
        "costume-primary-color":"#295782",
        "costume-secondary-color":"#FFFFFF",
        "costume-ternary-color":"#FFFFFF"
      },
      fontFamily:{
        montserrat:["Montserrat"],
        albertsans:["Albert Sans"],
        kumbhsans:["Kumbh Sans"]
      }
    },
  },
  plugins: [
    function({addComponents,theme}){
      addComponents({
        ".primary-button":{
          backgroundColor: theme('colors.costume-primary-color'), // Custom button background color
          color: '#FFFFFF', // Custom button text color
          
        },
        ".secondary-button":{
          backgroundColor: theme('colors.costume-ternary-color'), // Custom button background color
          color: "#000000", // Custom button text color
          borderColor: "#000000", // Custom border color (black)
          borderStyle: 'solid', // Equivalent to border-solid
          
        }
      })
    }
  ],
}