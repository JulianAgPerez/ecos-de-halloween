import { motion } from "framer-motion";

const ContentSection = () => {
  return (
    <section className="relative z-10 overflow-hidden px-5 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="halloween-flicker font-creepster mb-10 text-center text-5xl font-bold md:text-7xl"
      >
        Lo que esconde la tierra
      </motion.h2>

      <div className="mx-auto w-full max-w-3xl">
        <motion.div
          id="explicacion-halloween"
          className="text-gray-300"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="mt-2 text-2xl text-white">
            ¿Por qué se celebra el Halloween?
          </h3>

          <p className="paragraph">
            Halloween se celebra el 31 de octubre y tiene raíces en la antigua
            festividad celta conocida como Samhain.
          </p>
          <p className="paragraph">
            Esta celebración marcaba el final de la cosecha y el comienzo del
            invierno, una época asociada con la muerte y el mundo espiritual.
            Los celtas creían que en la noche de Samhain, los espíritus de los
            muertos regresaban a la tierra, y para protegerse de ellos,
            encendían hogueras y llevaban disfraces.
          </p>
          <p className="paragraph">
            Con el tiempo, esta tradición se mezcló con festividades
            cristianas, como el Día de Todos los Santos, que se celebra el 1 de
            noviembre. La noche anterior se convirtió en "All Hallows' Eve,"
            que eventualmente se transformó en "Halloween."
          </p>
          <p className="paragraph">
            A lo largo de los siglos, Halloween ha evolucionado y se ha
            popularizado, especialmente en Estados Unidos, donde tradiciones
            como el "trick-or-treat" (dulce o truco), las calabazas talladas y
            las fiestas de disfraces se han vuelto emblemáticas. Aunque hoy en
            día es principalmente una celebración divertida, sus orígenes están
            profundamente ligados a las creencias sobre la vida, la muerte y el
            cambio de estaciones.
          </p>
        </motion.div>

        <section id="explicacion-desarrollo" className="text-gray-300">
          <h3 className="mt-2 text-2xl text-white">
            ¿Por qué desarrollé esta web?
          </h3>
          <p className="mt-4 text-lg">
            Siempre he querido poder transmitir lo mejor posible las emociones
            que quiero causar en las historias que escribo, por lo cual siempre
            quise una web en la cuál poder subir mis escritos y poder elegir
            sonidos de ambiente, fondos, incluso la playlist que me arme para
            escribir inspirado, todo para aumentar lo máximo posible la
            inmersión con la historia.
          </p>
        </section>
      </div>
    </section>
  );
};

export default ContentSection;