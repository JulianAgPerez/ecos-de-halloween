const ContentSection = () => {
  return (
    <section className="bg-custom-purple text-center z-10 relative px-5 py-3">
      <h2 className="bg-texto-gif bg-clip-text text-transparent text-3xl font-bold">
        Más contenido
      </h2>

      <section id="explicacion-halloween" className="text-white">
        <h3 className="mt-2 text-2xl">¿Por qué se celebra el Halloween?</h3>

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
      <section id="explicacion-desarrollo" className="text-white">
        <h3 className="mt-2 text-2xl ">¿Por qué desarrollé esta web?</h3>
        <p className="mt-4 text-lg ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </section>
    </section>
  );
};

export default ContentSection;
