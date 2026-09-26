import { FC } from "react";
import { Link } from "react-router-dom";
import { FaGhost } from "react-icons/fa";
import Highlight from "./Highlight";

interface StoryListItemProps {
  title: string;
  to: string;
  active: boolean;
  onClick: () => void;
  query: string;
}

const StoryListItem: FC<StoryListItemProps> = ({
  title,
  to,
  active,
  onClick,
  query,
}) => (
  <li>
    <Link
      to={to}
      data-nav-item
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left rounded-lg text-base transition ${
        active
          ? "bg-custom-purple text-amber-300"
          : "text-gray-200 hover:bg-custom-purple hover:text-amber-300"
      }`}
    >
      <FaGhost size={14} className="text-purple-400 shrink-0" />
      <span className="truncate">
        <Highlight text={title} query={query} />
      </span>
    </Link>
  </li>
);

export default StoryListItem;
