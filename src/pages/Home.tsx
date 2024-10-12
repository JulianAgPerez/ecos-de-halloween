import { useState } from "react";
import AmbientSound from "../components/AmbientSound";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <AmbientSound
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        isPlaying={isPlaying}
      />
      {/* Contenedor con la imagen de fondo y efecto parallax */}
      <div className="bg-home-principal relative h-screen bg-fixed bg-cover bg-center">
        <div className="relative flex justify-between items-start">
          <button
            onClick={toggleSound}
            className="fixed top-5 right-5 p-0.5 bg-gradient-to-br from-purple-600 to-purple-900 rounded-full flex items-center justify-center overflow-hidden "
          >
            <span className="px-5 py-2.5 text-amber-600 ">
              {isPlaying ? (
                <FaVolumeUp size={24} />
              ) : (
                <FaVolumeMute size={24} />
              )}
            </span>
          </button>
        </div>

        <div className="flex justify-center items-center h-[40vh]">
          <h1 className="font-creepster text-white text-6xl md:text-9xl font-bold text-center">
            Feliz Halloween
          </h1>
        </div>
      </div>

      {/* Contenedor adicional que usa la misma imagen */}
      <div className="bg-home-principal relative bg-fixed bg-cover bg-center h-[15vh]">
        <h2 className="bg-texto-gif bg-clip-text text-transparent text-3xl font-bold text-center">
          Mas contenido
        </h2>
        <p className="mt-4 text-lg text-white text-center">Lorem ipsum</p>
      </div>
      <div className="layer crust">Corteza</div>
      <div className="layer hell">Infierno</div>
    </div>
  );
};

export default Home;
