import { useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import ScrollingCircle from "./ScrollingCircle";

const MIN_FONT_SIZE = 70;
const MAX_FONT_SIZE = 160;
const FONT_SIZE_STEP = 10;
const FONT_SIZE_KEY = "reader-font-size";

const readSavedFontSize = (): number => {
  try {
    const parsed = parseInt(localStorage.getItem(FONT_SIZE_KEY) ?? "", 10);
    return Number.isNaN(parsed) ? 100 : Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, parsed));
  } catch {
    return 100;
  }
};

interface StoryReaderProps {
  body: string;
}

const StoryReader = ({ body }: StoryReaderProps) => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(readSavedFontSize);

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

  return (
    <section className="flex flex-col items-center px-4">
      <div className="mt-4 flex w-full max-w-3xl items-center justify-end gap-2">
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
      <div className="note-background mt-2 w-full max-w-3xl text-left">
        <ScrollingCircle refProp={ref} />
        <pre ref={ref} className="text-lg leading-relaxed sm:text-xl" style={{ fontSize: `${fontSize}%` }}>
          {body}
        </pre>
      </div>
    </section>
  );
};

export default StoryReader;
