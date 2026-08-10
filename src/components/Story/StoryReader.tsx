import { useRef, useState } from "react";
import { FaMinus, FaMoon, FaPlus, FaSun } from "react-icons/fa";
import ReadingProgressBar from "./ReadingProgressBar";

const MIN_FONT_SIZE = 70;
const MAX_FONT_SIZE = 160;
const FONT_SIZE_STEP = 10;
const FONT_SIZE_KEY = "reader-font-size";
const NIGHT_MODE_KEY = "reader-night-mode";

const readSavedFontSize = (): number => {
  try {
    const parsed = parseInt(localStorage.getItem(FONT_SIZE_KEY) ?? "", 10);
    return Number.isNaN(parsed) ? 100 : Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, parsed));
  } catch {
    return 100;
  }
};

const readSavedNightMode = (): boolean => {
  try {
    return localStorage.getItem(NIGHT_MODE_KEY) === "on";
  } catch {
    return false;
  }
};

interface StoryReaderProps {
  body: string;
}

const StoryReader = ({ body }: StoryReaderProps) => {
  const ref = useRef<HTMLPreElement>(null);
  const [fontSize, setFontSize] = useState(readSavedFontSize);
  const [nightMode, setNightMode] = useState(readSavedNightMode);

  const changeFontSize = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, prev + delta));
      try {
        localStorage.setItem(FONT_SIZE_KEY, String(next));
      } catch {
        // storage not available
      }
      return next;
    });
  };

  const toggleNightMode = () => {
    setNightMode((prev) => {
      try {
        localStorage.setItem(NIGHT_MODE_KEY, prev ? "off" : "on");
      } catch {
        // storage not available
      }
      return !prev;
    });
  };

  return (
    <section className="flex flex-col items-center px-4">
      <div className="mt-4 flex w-full max-w-3xl items-center justify-end gap-2">
        <button
          type="button"
          onClick={toggleNightMode}
          aria-label={nightMode ? "Desactivar modo nocturno" : "Activar modo nocturno"}
          aria-pressed={nightMode}
          className={`rounded-lg p-2 transition ${
            nightMode
              ? "bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
              : "bg-purple-800/40 text-gray-200 hover:bg-purple-700/60"
          }`}
        >
          {nightMode ? <FaMoon size={14} /> : <FaSun size={14} />}
        </button>
        <button
          type="button"
          onClick={() => changeFontSize(-FONT_SIZE_STEP)}
          aria-label="Reducir tamaño de letra"
          className="rounded-lg bg-purple-800/40 p-2 text-gray-200 transition hover:bg-purple-700/60"
        >
          <FaMinus size={12} />
        </button>
        <span className="w-10 text-center text-xs text-gray-300 tabular-nums" aria-live="polite">
          {fontSize}%
        </span>
        <button
          type="button"
          onClick={() => changeFontSize(FONT_SIZE_STEP)}
          aria-label="Aumentar tamaño de letra"
          className="rounded-lg bg-purple-800/40 p-2 text-gray-200 transition hover:bg-purple-700/60"
        >
          <FaPlus size={12} />
        </button>
      </div>
      <div
        className={`note-background mt-2 w-full max-w-3xl text-left ${
          nightMode ? "night-mode" : ""
        }`}
      >
        <ReadingProgressBar targetRef={ref} nightMode={nightMode} />
        <pre ref={ref} className="text-lg leading-relaxed sm:text-xl" style={{ fontSize: `${fontSize}%` }}>
          {body}
        </pre>
      </div>
    </section>
  );
};

export default StoryReader;
