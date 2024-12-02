import { useRef } from "react";
import witchGif from "../../assets/images/witch-gif.gif";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const ContentSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 800px)",
  });

  //Transformaciones para mov de gif
  const yTransform = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    isDesktopOrLaptop
      ? ["-150px", "50%", "50%", "400%"]
      : ["-100%", "200%", "200%", "700%"]
  );
  const xTransform = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    isDesktopOrLaptop ? ["-100%", "0%", "900%"] : ["-100px", "0px", "320px"]
  );

  return (
    <section
      ref={containerRef}
      className="bg-custom-purple text-center z-10 relative px-5 py-3 overflow-hidden"
    >
      <motion.img
        style={{ y: yTransform, x: xTransform, cursor: "pointer" }}
        drag
        dragConstraints={{ top: 100, bottom: 300, left: 100, right: 1000 }}
        src={witchGif}
        className="absolute z-20 inset-0 "
      />
      <h2 className="bg-texto-gif bg-clip-text text-transparent text-3xl font-bold">
        Más contenido
      </h2>
      <section id="explicacion-halloween" className="text-gray-300">
        <h3 className="mt-2 text-2xl text-white">
          ¿Por qué se celebra el Halloween?
        </h3>

        <p className="paragraph">
          Halloween se celebra el 31 de octubre y tiene raíces en la antigua
          festividad celta conocida como Samhain.
        </p>
        <p className="paragraph">
          Esta celebración marcaba el final de la cosecha y el comienzo del
          invierno, una época asociada con la muerte y el mundo espiritual. Los
          celtas creían que en la noche de Samhain, los espíritus de los muertos
          regresaban a la tierra, y para protegerse de ellos, encendían hogueras
          y llevaban disfraces.
        </p>
        <p className="paragraph">
          Con el tiempo, esta tradición se mezcló con festividades cristianas,
          como el Día de Todos los Santos, que se celebra el 1 de noviembre. La
          noche anterior se convirtió en "All Hallows' Eve," que eventualmente
          se transformó en "Halloween."
        </p>
        <p className="paragraph">
          A lo largo de los siglos, Halloween ha evolucionado y se ha
          popularizado, especialmente en Estados Unidos, donde las tradiciones
          como el "trick-or-treat" (dulce o truco), las calabazas talladas y las
          fiestas de disfraces se han vuelto emblemáticas. Aunque hoy en día es
          principalmente una celebración divertida, sus orígenes están
          profundamente ligados a las creencias sobre la vida, la muerte y el
          cambio de estaciones.
        </p>
      </section>
      <section id="explicacion-desarrollo" className="text-gray-300">
        <h3 className="mt-2 text-2xl text-white">
          ¿Por qué desarrollé esta web?
        </h3>
        <p className="mt-4 text-lg ">
          Siempre he querido poder transmitir lo mejor posible las emociones que
          quiero causar en las historias que escribo, por lo cual siempre quize
          una web en la cuál poder subir mis escritos y poder elegir sonidos de
          ambiente, fondos, incluso la playlist que me arme para escribir
          inspirado, todo para aumentar lo máximo posible la inmersión con la
          historia.
        </p>
      </section>
    </section>
  );
};

export default ContentSection;
