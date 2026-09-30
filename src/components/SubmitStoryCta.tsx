import { FC } from "react";
import { Link } from "react-router-dom";
import { FaFeatherAlt, FaPenNib } from "react-icons/fa";

interface SubmitStoryCtaProps {
  variant: "banner" | "menu";
  className?: string;
  onClick?: () => void;
}

const BANNER_CLASS =
  "group glass-card flex w-full cursor-pointer flex-col items-center gap-3 px-6 py-10 text-center transition hover:border-amber-400/60";
const MENU_CLASS =
  "w-full flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-lg transition";

const SubmitStoryCta: FC<SubmitStoryCtaProps> = ({
  variant,
  className = "",
  onClick,
}) => {
  const isBanner = variant === "banner";

  return (
    <Link
      to="/upload-story"
      onClick={onClick}
      className={`${isBanner ? BANNER_CLASS : MENU_CLASS} ${className}`}
    >
      {isBanner ? (
        <FaPenNib className="text-3xl text-purple-400" aria-hidden="true" />
      ) : (
        <FaFeatherAlt size={18} className="text-purple-400" aria-hidden="true" />
      )}
      {isBanner ? (
        <span className="text-xl font-bold text-amber-400 group-hover:text-amber-300">
          Contanos tu terror
        </span>
      ) : (
        <span className="text-amber-400">Enviar tu cuento</span>
      )}
      {isBanner && (
        <span className="max-w-md text-sm text-gray-300">
          Escribilo acá, sin registro. Apenas lo envíes queda disponible para
          que todos lo lean.
        </span>
      )}
    </Link>
  );
};

export default SubmitStoryCta;
