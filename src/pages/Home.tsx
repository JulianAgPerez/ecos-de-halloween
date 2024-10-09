const Home = ({}) => {
  return (
    <div>
      {/* Contenedor con la imagen de fondo y efecto parallax */}
      <div className="bg-home-principal relative h-screen bg-fixed bg-cover bg-center">
        <div className="flex justify-center items-center h-[40vh]">
          <h1 className="font-creepster text-white text-6xl md:text-9xl font-bold text-center">
            Feliz Halloween
          </h1>
        </div>
      </div>

      {/* Contenedor adicional que usa la misma imagen */}
      <div className="bg-gray-300 p-10 text-center">
        <div className="bg-home-principal relative bg-fixed bg-cover bg-center h-[15vh]">
          <h2 className="text-white text-3xl font-bold text-center">
            Mas contenido
          </h2>
          <p className="mt-4 text-lg text-white text-center">Lorem ipsum</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
