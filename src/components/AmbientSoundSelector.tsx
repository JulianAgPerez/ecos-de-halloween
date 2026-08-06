import { FC, useEffect, useRef, useState } from "react";
import { FaCheck, FaMusic } from "react-icons/fa";
import { sounds, soundLabels } from "../assets/sounds/sounds";
import useSoundStore from "../store/useSoundStore";

const AmbientSoundSelector: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { activeSound, setActiveSound } = useSoundStore();

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Elegir sonido de ambiente"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900 p-0.5 overflow-hidden hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-1000"
      >
        <span className="px-5 py-2.5 text-amber-600">
          <FaMusic size={20} />
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Sonidos de ambiente"
          className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto rounded-lg border border-purple-800/60 bg-gray-900 shadow-lg"
        >
          <p className="px-4 pt-3 pb-2 text-xs uppercase tracking-wide text-gray-400">
            Sonido ambiente
          </p>
          <ul>
            {(Object.keys(sounds) as (keyof typeof sounds)[]).map((key) => {
              const selected = sounds[key] === activeSound;
              return (
                <li key={key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveSound(sounds[key]);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition ${
                      selected
                        ? "bg-custom-purple text-amber-300"
                        : "text-gray-200 hover:bg-custom-purple hover:text-amber-300"
                    }`}
                  >
                    <span className="truncate">
                      {soundLabels[key] ?? key}
                    </span>
                    {selected && <FaCheck size={12} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AmbientSoundSelector;
