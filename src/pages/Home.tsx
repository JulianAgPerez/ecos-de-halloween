import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AmbientSound from "../components/AmbientSound";
import { sounds } from "../assets/sounds/sounds";
import ContentSection from "../components/Home/ContentSection";
import VolumeButton from "../components/VolumeButton";
import useSoundStore from "../store/UseSoundStore";

const Home = () => {
  const { addSound } = useSoundStore();

  // setup de Parallax
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Transformacion para texto (complementario de parallax)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  useEffect(() => {
    Object.values(sounds).forEach((sound) => addSound(sound));
  }, [addSound]);

  return (
    <div ref={ref}>
      {Object.values(sounds).map((sound) => (
        <AmbientSound key={sound} src={sound} />
      ))}
      {/* Contenedor con la imagen de fondo y efecto parallax */}
      <div className="relative h-screen overflow-hidden grid place-items-center ">
        <motion.h1
          style={{ y: textY }}
          className="font-creepster text-white text-6xl md:text-9xl font-bold text-center z-20 relative"
        >
          Feliz Halloween
        </motion.h1>

        <motion.div
          className="absolute inset-0 bg-home-principal bg-cover bg-bottom"
          style={{
            y: backgroundY,
          }}
        />
        <div className=" absolute inset-0 z-19 bg-home-piso md:bg-home-secundaria-clean bg-cover bg-bottom" />

        {/* <DropdownMenu /> */}
        <VolumeButton />
      </div>
      <ContentSection />
      {/* Sección de "Corteza" No se si agregar imagenes o que */}
      <div className="layer crust"></div>
      {/*       <div className="layer hell">Infierno</div>
       */}{" "}
    </div>
  );
};

export default Home;

/*
//Alternativa con componente (genera una especie de ruido o linea blanca molesta arriba del todo)
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
    <div>
      {Object.values(sounds).map((sound) => (
        <AmbientSound key={sound} src={sound} />
      ))}
      <ParallaxBackground text="Feliz Halloween" />
      <VolumeButton />
      <ContentSection />
      <div className="layer crust"></div>
    </div>
  );
};

export default Home;

*/
