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
              cristianas, como el Día de Todos los Santos, que se celebra el 1
              de noviembre. La noche anterior se convirtió en «All Hallows'
              Eve», que eventualmente se transformó en «Halloween».
            </p>
            <p className="paragraph">
              A lo largo de los siglos, Halloween ha evolucionado y se ha
              popularizado, especialmente en Estados Unidos, donde tradiciones
              como el «trick-or-treat» (dulce o truco), las calabazas talladas y
              las fiestas de disfraces se han vuelto emblemáticas. Aunque hoy en
              día es principalmente una celebración divertida, sus orígenes
              están profundamente ligados a las creencias sobre la vida, la
              muerte y el cambio de estaciones.
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
            fondos e incluso la playlist que armé para escribir inspirado, todo
            para aumentar lo máximo posible la inmersión en la historia.
          </p>
        </section>

        <section className="text-gray-300">
          <h3 className="mt-2 text-2xl text-white">Dato curioso</h3>
          <p className="mt-4 text-lg">
            Estos cuentos no los escribí porque sí: los mandé a un concurso de
            escritura. Había varias temáticas y yo me metí en Fantasmas,
            Monstruos y Seres intertemporales e interdimensionales. El premio
            era una copia digital de un libro que el propio autor les regalaba a
            los 3 ganadores.
          </p>
          <p className="mt-4 text-lg">
            Cada historia la escribí en una noche, con una playlist de fondo
            para agarrar el ritmo. Al final gané la de Monstruos con «El heraldo
            del fin», que sigue siendo de las que más me gusta.
          </p>
          <p className="mt-4 text-lg">
            Si leen las historias, se va a notar que tengo una inclinación por
            el horror cósmico. De chico leía libros de astronomía y libros y me
            quedó esa fobia y fascinacion por igual de los agujeros negros, las
            supernovas, los cuásares... la magnitud absurda de todo. No sé, es
            algo que me marcó mucho, y quizás por eso casi todas mis historias
            terminan siendo un poco cósmicas.
          </p>
        </section>
      </div>
    </section>
  );
};

export default ContentSection;
