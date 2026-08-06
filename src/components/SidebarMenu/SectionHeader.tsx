import { FC } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { FaChevronDown } from "react-icons/fa";

interface SectionHeaderProps {
  headingId: string;
  listId: string;
  label: string;
  icon: IconType;
  count: number;
  open: boolean;
  onToggle: () => void;
}

const SectionHeader: FC<SectionHeaderProps> = ({
  headingId,
  listId,
  label,
  icon: Icon,
  count,
  open,
  onToggle,
}) => (
  <>
    <h2 id={headingId} className="sr-only">
      {label}
    </h2>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={listId}
      className="sticky top-0 bg-gray-900 z-10 w-full flex items-center justify-between gap-2 py-2 text-left"
    >
      <span className="flex items-center gap-2 text-amber-400 font-creepster text-xl">
        <Icon size={16} className="text-purple-400" />
        {label}
      </span>
      <span className="flex items-center gap-2 text-xs text-gray-400">
        {count}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown size={14} className="text-amber-400" />
        </motion.span>
      </span>
    </button>
  </>
);

export default SectionHeader;
