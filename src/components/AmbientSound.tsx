import { FC, useEffect, useRef } from "react";
import useSoundStore from "../store/useSoundStore";

const AmbientSound: FC<{ src: string }> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, activeSound, setActiveSound } = useSoundStore();

  useEffect(() => {
    if (audioRef.current) {
      if (src === activeSound && isPlaying) {
        audioRef.current.volume = 0.5;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [src, activeSound, isPlaying]);

  useEffect(() => {
    setActiveSound(src);
  }, [src, activeSound]);

  return (
    <audio ref={audioRef} loop>
      <source src={src} type="audio/mp3" />
    </audio>
  );
};

export default AmbientSound;
