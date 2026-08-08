import Reveal from "./Reveal";

const ContentSection = () => {
  return (
    <section className="relative z-10 overflow-hidden px-5 py-16">
      <Reveal amount={0.4} y={16}>
        <h2 className="halloween-flicker font-creepster mb-10 text-center text-5xl font-bold md:text-7xl">
          Lo que esconde la tierra
        </h2>
      </Reveal>

      <div className="mx-auto w-full max-w-3xl">
        <Reveal amount={0.2}>
          <div id="explicacion-halloween" className="text-gray-300">
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
            noviembre. La noche anterior se convirtió en «All Hallows' Eve»,
            que eventualmente se transformó en «Halloween».
          </p>
          <p className="paragraph">
            A lo largo de los siglos, Halloween ha evolucionado y se ha
            popularizado, especialmente en Estados Unidos, donde tradiciones
            como el «trick-or-treat» (dulce o truco), las calabazas talladas y
            las fiestas de disfraces se han vuelto emblemáticas. Aunque hoy en
            día es principalmente una celebración divertida, sus orígenes están
            profundamente ligados a las creencias sobre la vida, la muerte y el
            cambio de estaciones.
          </p>
          </div>
        </Reveal>

        <section id="explicacion-desarrollo" className="text-gray-300">
          <h3 className="mt-2 text-2xl text-white">
            ¿Por qué desarrollé esta web?
          </h3>
          <p className="mt-4 text-lg">
            Siempre quise transmitir lo mejor posible las emociones que busco
            causar en las historias que escribo, por lo que soñaba con una web
            en la cual subir mis escritos y poder elegir sonidos de ambiente,
            fondos e incluso la playlist que armé para escribir inspirado,
            todo para aumentar lo máximo posible la inmersión en la historia.
          </p>
        </section>

        <section className="text-gray-300">
          <h3 className="mt-2 text-2xl text-white">
            Dato curioso
          </h3>
          <p className="mt-4 text-lg">
            Estos cuentos los escribí para un concurso en el que había
            distintas temáticas: el que ganara en más temáticas obtenía una
            copia digital de un libro que el mismo autor regalaba a los 3
            ganadores.
          </p>
        </section>
      </div>
    </section>
  );
};

export default ContentSection;