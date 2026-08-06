import { FC, useEffect, useRef } from "react";
import useSoundStore from "../store/useSoundStore";

const AmbientSound: FC<{ src: string }> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, activeSound } = useSoundStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (src === activeSound && isPlaying) {
      audio.volume = 0.5;
      audio.play();
    } else {
      audio.pause();
    }
  }, [src, activeSound, isPlaying]);

  return (
    <audio ref={audioRef} loop>
      <source src={src} type="audio/mp3" />
    </audio>
  );
};

export default AmbientSound;
