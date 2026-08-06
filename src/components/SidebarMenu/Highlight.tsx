import { FC } from "react";

const Highlight: FC<{ text: string; query: string }> = ({ text, query }) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return <>{text}</>;
  const index = text.toLowerCase().indexOf(normalizedQuery);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-amber-400/30 text-amber-200 rounded px-0.5">
        {text.slice(index, index + normalizedQuery.length)}
      </mark>
      {text.slice(index + normalizedQuery.length)}
    </>
  );
};

export default Highlight;
