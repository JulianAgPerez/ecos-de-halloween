import { FC, MouseEvent } from "react";
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
import { HOME_BACKGROUND_URL } from "../config";
import { getDaysUntilHalloween, getSeason, type Season } from "../utils/season";

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

const handleCountdownClick = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
};

const PILL_BASE_CLASSES =
  "inline-flex items-center rounded-full border bg-black/30 px-5 py-2 text-sm font-medium tracking-wide backdrop-blur-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

const HERO_TITLES: Record<Season, string> = {
  october: "La oscuridad se acerca",
  "halloween-day": "Feliz Halloween",
  "off-season": "El bosque espera",
};

const Home = () => {
  const season = getSeason();
  const daysLeft = getDaysUntilHalloween();

  const heroTitle = HERO_TITLES[season];

  const daysCopy = daysLeft === 1 ? "Falta 1 día" : `Faltan ${daysLeft} días`;

  const pillLabel =
    season === "halloween-day"
      ? "¡Es esta noche! ↓"
      : daysLeft === 0
        ? "¡Mañana es la noche! ↓"
        : `${daysCopy} ↓`;

  const pillClassName =
    season === "october"
      ? `${PILL_BASE_CLASSES} border-orange-400 text-orange-200 shadow-[0_0_18px_rgba(249,115,22,0.45)] hover:border-orange-300 hover:bg-orange-500/15 hover:text-orange-100 hover:shadow-[0_0_28px_rgba(249,115,22,0.65)]`
      : `${PILL_BASE_CLASSES} border-orange-500/30 text-orange-200 hover:border-orange-500/60 hover:bg-orange-500/10 hover:text-orange-100`;

  const countdownAriaLabel =
    season === "halloween-day"
      ? "Ir al contador de Halloween: ¡es esta noche!"
      : daysLeft === 0
        ? "Ir al contador de Halloween: ¡mañana es la noche!"
        : daysLeft === 1
          ? "Ir al contador de Halloween: falta 1 día"
          : `Ir al contador de Halloween: faltan ${daysLeft} días`;

  return (
    <div className="relative">
      <h1 className="sr-only">Ecos de Halloween</h1>
      <DepthIndicator />
      <DepthHeat />
      <WitchJourney />

      {/* Escena 1 — Bosque (superficie) */}
      <div className="relative">
        <ParallaxBackground
          imageUrl={HOME_BACKGROUND_URL}
          title={
            <div className="flex flex-col items-center gap-6 px-4 text-center">
              <span className="halloween-flicker font-creepster text-6xl font-bold block md:text-9xl">
                {heroTitle}
              </span>
              <a
                href="#countdown"
                onClick={handleCountdownClick}
                aria-label={countdownAriaLabel}
                className={pillClassName}
              >
                {pillLabel}
              </a>
            </div>
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
        <div className="relative z-20">
          <HorrorEasterEggs />
          <FeatureCards />
          <HalloweenTrivia />
        </div>
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
