import { FC, useEffect, useState } from "react";
import { FaGhost } from "react-icons/fa";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { getHalloweenTarget } from "../../utils/season";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getTimeLeft = (): TimeLeft => {
  const diff = Math.max(0, getHalloweenTarget().getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
};

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
];

const HalloweenCountdown: FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div id="countdown" className="mx-auto w-full max-w-4xl px-5 py-20 text-center">
      <SectionHeading icon={FaGhost} size="lg" className="mb-4">
        Hasta que la noche nos llame
      </SectionHeading>
      <p className="mb-10 text-lg text-orange-200/80">
        {timeLeft.days === 0
          ? "¡Esta noche es Halloween!"
          : `Faltan ${timeLeft.days} ${timeLeft.days === 1 ? "día" : "días"} para el 31 de octubre.`}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {UNITS.map((unit, i) => (
          <Reveal
            key={unit.key}
            delay={i * 0.1}
            amount={0.5}
            className="rounded-2xl border border-orange-500/30 bg-black/30 p-5 backdrop-blur-sm"
          >
            <div className="halloween-flicker font-creepster text-4xl md:text-6xl">
              {String(timeLeft[unit.key]).padStart(2, "0")}
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-orange-200/70">
              {unit.label}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default HalloweenCountdown;