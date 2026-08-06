import { FC } from "react";
import { FaBookDead } from "react-icons/fa";
import Highlight from "./Highlight";

interface ClassicListItemProps {
  title: string;
  author: string;
  active: boolean;
  onClick: () => void;
  query: string;
}

const ClassicListItem: FC<ClassicListItemProps> = ({
  title,
  author,
  active,
  onClick,
  query,
}) => (
  <li>
    <button
      data-nav-item
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg text-base transition ${
        active
          ? "bg-custom-purple text-amber-300"
          : "text-gray-200 hover:bg-custom-purple hover:text-amber-300"
      }`}
    >
      <FaBookDead size={14} className="text-purple-400 shrink-0" />
      <span className="min-w-0">
        <span className="block truncate">
          <Highlight text={title} query={query} />
        </span>
        <span className="block text-xs text-gray-400 italic truncate">
          <Highlight text={author} query={query} />
        </span>
      </span>
    </button>
  </li>
);

export default ClassicListItem;
