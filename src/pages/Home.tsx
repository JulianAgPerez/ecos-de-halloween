import { useEffect } from "react";
import AmbientSound from "../components/AmbientSound";
import { sounds } from "../assets/sounds/sounds";
import ContentSection from "../components/Home/ContentSection";
import VolumeButton from "../components/VolumeButton";
import useSoundStore from "../store/useSoundStore";
import ParallaxBackground from "../components/ParallaxBackground";

const Home = () => {
  const { addSound } = useSoundStore();

  useEffect(() => {
    Object.values(sounds).forEach((sound) => addSound(sound));
  }, [addSound]);

  return (
    <ParallaxBackground defaultBackgroundClass="bg-home-principal">
      {Object.values(sounds).map((sound) => (
        <AmbientSound key={sound} src={sound} />
      ))}
      <h1 className="font-creepster text-white text-6xl md:text-9xl font-bold text-center z-20 relative">
        Feliz Halloween
      </h1>
      <VolumeButton />
      <ContentSection />
    </ParallaxBackground>
  );
};

export default Home;
