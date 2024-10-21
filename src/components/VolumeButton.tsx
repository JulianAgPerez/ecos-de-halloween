import React, { FC } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface VolumeButtonProps {
  isPlaying: boolean;
  toggleSound: () => void;
}

const VolumeButton: FC<VolumeButtonProps> = ({ isPlaying, toggleSound }) => {
  return (
    <div className="relative flex justify-between items-start z-30">
      <button
        onClick={toggleSound}
        className="fixed top-5 right-5 p-0.5 bg-gradient-to-br from-purple-600 to-purple-900 rounded-full flex items-center justify-center overflow-hidden hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-1000 "
      >
        <span className="px-5 py-2.5 text-amber-600">
          {isPlaying ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
        </span>
      </button>
    </div>
  );
};

export default VolumeButton;
