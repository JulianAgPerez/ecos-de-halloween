import React, { useEffect, useRef } from "react";

interface AmbientSoundProps {
  src: string;
  isPlaying: boolean;
}

const AmbientSound: React.FC<AmbientSoundProps> = ({ src, isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying
        ? ((audioRef.current.volume = 0.5), audioRef.current.play())
        : (audioRef.current.volume = 0);
    }
  }, [isPlaying]);

  return (
    <audio ref={audioRef} loop>
      <source src={src} type="audio/mp3" />
    </audio>
  );
};

export default AmbientSound;
