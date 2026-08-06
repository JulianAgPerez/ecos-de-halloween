import { FC } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import useSoundStore from "../store/useSoundStore";

const VolumeButton: FC = () => {
  const { isPlaying, toggleSound } = useSoundStore();

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={
        isPlaying ? "Silenciar sonido ambiente" : "Activar sonido ambiente"
      }
      title={isPlaying ? "Silenciar" : "Activar sonido"}
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900 p-0.5 overflow-hidden hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-1000"
    >
      <span className="px-5 py-2.5 text-amber-600">
        {isPlaying ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
      </span>
    </button>
  );
};

export default VolumeButton;
