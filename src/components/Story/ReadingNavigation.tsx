import { FC } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ReadingNavigationProps {
  onBack: () => void;
  previousTitle?: string;
  nextTitle?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

const ReadingNavigation: FC<ReadingNavigationProps> = ({
  onBack,
  previousTitle,
  nextTitle,
  onPrevious,
  onNext,
}) => {
  const canGoPrevious = Boolean(previousTitle) && Boolean(onPrevious);
  const canGoNext = Boolean(nextTitle) && Boolean(onNext);

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 mb-4 max-w-3xl mx-auto px-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-200 bg-purple-800/40 hover:bg-purple-700/60 transition"
      >
        <FaArrowLeft size={14} />
        Volver
      </button>
      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-disabled={!canGoPrevious}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-200 bg-purple-800/40 hover:bg-purple-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <FaArrowLeft size={14} />
          Anterior
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          aria-disabled={!canGoNext}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-200 bg-purple-800/40 hover:bg-purple-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Siguiente
          <FaArrowRight size={14} />
        </button>
      </div>
    </nav>
  );
};

export default ReadingNavigation;
