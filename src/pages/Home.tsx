import { FC } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ContentSection from "../components/Home/ContentSection";
import DepthDivider from "../components/Home/DepthDivider";
import DepthIndicator from "../components/Home/DepthIndicator";
import CaveDecor from "../components/Home/CaveDecor";
import FloatingEmbers from "../components/Home/FloatingEmbers";
import StoryCatalog from "../components/Home/StoryCatalog";
import ContinueReading from "../components/Home/ContinueReading";
import FeatureCards from "../components/Home/FeatureCards";
import HalloweenCountdown from "../components/Home/HalloweenCountdown";
import HalloweenTrivia from "../components/Home/HalloweenTrivia";
import TerrorQuote from "../components/Home/TerrorQuote";
import HorrorEasterEggs from "../components/Home/HorrorEasterEggs";
import WitchJourney from "../components/Home/WitchJourney";
import ParallaxBackground from "../components/ParallaxBackground";

const HOME_BACKGROUND_URL =
  "https://res.cloudinary.com/diauphrb6/image/upload/v1729461842/ecos%20de%20halloween/fondo-halloween-bosque-embrujado_uummki.jpg";

const DepthHeat: FC = () => {
  const { scrollYProgress } = useScroll();
  const heatOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 0.55]);
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: heatOpacity }}
      className="pointer-events-none fixed inset-0 z-30 bg-gradient-to-t from-red-900/80 via-orange-950/40 to-transparent"
    />
  );
};

const Home = () => {
  return (
    <div className="relative">
      <DepthIndicator />
      <DepthHeat />
      <WitchJourney />

      {/* Escena 1 — Bosque (superficie) */}
      <div className="relative">
        <ParallaxBackground
          imageUrl={HOME_BACKGROUND_URL}
          title={
            <span className="halloween-flicker font-creepster text-6xl font-bold text-center block md:text-9xl">
              Feliz Halloween
            </span>
          }
          textSpeed={700}
        />
      </div>

      {/* Transición: entramos al suelo */}
      <DepthDivider variant="soil" />

      {/* Escena 2 — Subterráneo (tierra) */}
      <section className="soil-texture relative bg-custom-purple">
        <ContentSection />
        <StoryCatalog />
        <ContinueReading />
      </section>

      {/* Transición: descendemos a las cuevas */}
      <DepthDivider variant="rock" size="lg" />

      {/* Escena 3 — Cuevas (profundidad) */}
      <section className="relative bg-[#141126]">
        <CaveDecor />
        <HorrorEasterEggs />
        <FeatureCards />
        <HalloweenTrivia />
      </section>

      {/* Transición: la tierra se enciende, bajamos al inframundo */}
      <DepthDivider variant="embers" />

      {/* Escena 4 — Inframundo (el final) */}
      <section className="underworld relative overflow-hidden">
        <FloatingEmbers />
        <HalloweenCountdown />
        <TerrorQuote />
      </section>
    </div>
  );
};

export default Home;