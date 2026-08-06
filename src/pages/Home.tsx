import ContentSection from "../components/Home/ContentSection";
import SectionDivider from "../components/Home/SectionDivider";
import ParallaxBackground from "../components/ParallaxBackground";

const HOME_BACKGROUND_URL =
  "https://res.cloudinary.com/diauphrb6/image/upload/v1729461842/ecos%20de%20halloween/fondo-halloween-bosque-embrujado_uummki.jpg";

const Home = () => {
  return (
    <div>
      <ParallaxBackground
        imageUrl={HOME_BACKGROUND_URL}
        title={
          <span className="halloween-flicker font-creepster text-6xl md:text-9xl font-bold text-center block">
            Feliz Halloween
          </span>
        }
        textSpeed={700}
      />
      <SectionDivider />
      <ContentSection />
      {/* Sección de "Corteza" No se si agregar imagenes o que */}
      <div className="layer crust"></div>
    </div>
  );
};

export default Home;
