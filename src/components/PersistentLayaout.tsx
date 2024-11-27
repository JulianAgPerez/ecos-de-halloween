import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AmbientSound from "../components/AmbientSound";
import { sounds } from "../assets/sounds/sounds";
import useSoundStore from "../store/useSoundStore";
import VolumeButton from "../components/VolumeButton";

const PersistentLayout = () => {
  const { addSound } = useSoundStore();

  useEffect(() => {
    Object.values(sounds).forEach((sound) => addSound(sound));
  }, [addSound]);

  return (
    <div>
      {Object.values(sounds).map((sound, index) => (
        <AmbientSound key={index} src={sound} />
      ))}
      <VolumeButton />
      <Outlet />
    </div>
  );
};

export default PersistentLayout;
