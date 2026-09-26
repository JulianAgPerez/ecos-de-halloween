import { FC, useEffect, useRef, useState } from "react";
import { FaCheck, FaMusic } from "react-icons/fa";
import { sounds, soundLabels } from "../assets/sounds/sounds";
import useSoundStore from "../store/useSoundStore";

const PANEL_ID = "ambient-sound-options";

const AmbientSoundSelector: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);
  const activeSound = useSoundStore((state) => state.activeSound);
  const setActiveSound = useSoundStore((state) => state.setActiveSound);

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

  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;
    if (wasOpen === isOpen) return;
    if (isOpen) {
      firstOptionRef.current?.focus();
    } else {
      toggleRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={panelRef} className="relative">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Elegir sonido de ambiente"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        className="flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900 p-0.5 overflow-hidden hover:from-purple-700 hover:to-purple-800 active:from-purple-900 active:to-purple-950 transition duration-1000"
      >
        <span className="px-5 py-2.5 text-amber-300">
          <FaMusic size={20} />
        </span>
      </button>

      {isOpen && (
        <div
          id={PANEL_ID}
          role="group"
          aria-label="Sonidos de ambiente"
          className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto rounded-lg border border-purple-800/60 bg-gray-900 shadow-lg"
        >
          <p className="px-4 pt-3 pb-2 text-xs uppercase tracking-wide text-gray-400">
            Sonido ambiente
          </p>
          <ul>
            {(Object.keys(sounds) as (keyof typeof sounds)[]).map(
              (key, index) => {
                const selected = sounds[key] === activeSound;
                return (
                  <li key={key}>
                    <button
                      ref={index === 0 ? firstOptionRef : undefined}
                      type="button"
                      aria-pressed={selected}
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
              },
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AmbientSoundSelector;
