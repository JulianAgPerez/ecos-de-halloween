import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-home-principal bg-cover bg-center px-6 text-center">
      <p className="font-creepster text-9xl text-amber-400 [text-shadow:0_0_20px_rgba(251,191,36,0.6)]">
        404
      </p>
      <div className="ghost-loader mt-4">
        <div className="ghost">
          <div className="face"></div>
        </div>
        <div className="shadow"></div>
      </div>
      <p className="mt-6 text-xl text-gray-200">
        Te perdiste en la noche...
      </p>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        Esta página no existe o fue tragada por la oscuridad. Mejor vuelve a un
        lugar seguro.
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-8 rounded-lg bg-purple-800/60 px-6 py-3 text-lg text-amber-300 transition hover:bg-purple-700/80"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
