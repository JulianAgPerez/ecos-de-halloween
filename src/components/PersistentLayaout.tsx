import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AmbientSound from "../components/AmbientSound";
import AmbientSoundSelector from "../components/AmbientSoundSelector";
import { sounds } from "../assets/sounds/sounds";
import useSoundStore from "../store/useSoundStore";
import VolumeButton from "../components/VolumeButton";

const PersistentLayout = () => {
  const { addSound, activeSound, setActiveSound } = useSoundStore();

  useEffect(() => {
    const allSounds = Object.values(sounds);
    allSounds.forEach((sound) => addSound(sound));
    if (!activeSound) {
      setActiveSound(allSounds[allSounds.length - 1]);
    }
  }, [addSound, activeSound, setActiveSound]);

  return (
    <div>
      {Object.values(sounds).map((sound, index) => (
        <AmbientSound key={index} src={sound} />
      ))}
      <VolumeButton />
      <AmbientSoundSelector />
      <Outlet />
    </div>
  );
};

export default PersistentLayout;
