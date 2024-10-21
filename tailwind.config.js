/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {backgroundImage: {
      'home-principal': "url('https://res.cloudinary.com/diauphrb6/image/upload/v1729461842/ecos%20de%20halloween/fondo-halloween-bosque-embrujado_uummki.jpg')",
      'home-secundaria': "url('https://res.cloudinary.com/diauphrb6/image/upload/v1729464245/ecos%20de%20halloween/fondo-halloween-bosque-embrujado-recortado_ntsnyx.png')",
      'home-secundaria-clean': "url('https://res.cloudinary.com/diauphrb6/image/upload/v1729465522/ecos%20de%20halloween/fondo-halloween.recortado_ey2hp0.png')",
      'home-piso':"url('https://res.cloudinary.com/diauphrb6/image/upload/v1729468365/ecos%20de%20halloween/Fondo-halloween-piso_ozdymf.png')",
      'texto-titulo': "url('src/assets/calaveras.png')",
      'texto-gif': "url('https://media.giphy.com/media/12JhUC7wZgbKjC/giphy.gif?cid=790b7611ubdj1l3w881hpj5wvsq5hd67he5nqpowfgzepj45&ep=v1_gifs_search&rid=giphy.gif&ct=g')"
    },
    fontFamily: {
      creepster: ["'Creepster'", "cursive"],
      //crimson: ["'Crimson Text'", "serif"], /* ya lo aplico en index.css, en caso de agregar una 3ra fuente: descomentar*/
    },},
  },
  plugins: [],
}
