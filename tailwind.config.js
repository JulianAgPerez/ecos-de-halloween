/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {backgroundImage: {
      'home-principal': "url('https://img.freepik.com/foto-gratis/fondo-halloween-bosque-embrujado_23-2151853120.jpg?t=st=1728429346~exp=1728432946~hmac=38cd1d7ba9e1041121b542342db34d55a2e910a678b7f10758769018b02fcc11&w=740')",
      'home-secundaria': "url('URL_DE_OTRA_IMG)",
      'texto-titulo': "url('src/assets/calaveras.png')",
      'texto-gif': "url('https://media.giphy.com/media/12JhUC7wZgbKjC/giphy.gif?cid=790b7611ubdj1l3w881hpj5wvsq5hd67he5nqpowfgzepj45&ep=v1_gifs_search&rid=giphy.gif&ct=g')"
    },
    fontFamily: {
      creepster: ["'Creepster'", "cursive"],
      //crimson: ["'Crimson Text'", "serif"], /* ya lo aplico en index.css, en caso de agregar una 3ra fuente: descomentar*/
    },
    colors: {
      'custom-purple': '#1E193A',
    },},
  },
  plugins: [],
}
