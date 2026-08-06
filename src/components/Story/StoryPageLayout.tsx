import { CSSProperties, FC, ReactNode } from "react";
import SpotifyPlayer from "../SpotifyPlayer";
import StoryReader from "./StoryReader";

interface StoryPageLayoutProps {
  title: string;
  backgroundClass?: string;
  backgroundStyle?: CSSProperties;
  meta?: ReactNode;
  body?: string;
  footer?: ReactNode;
}

const StoryPageLayout: FC<StoryPageLayoutProps> = ({
  title,
  backgroundClass = "bg-home-principal",
  backgroundStyle,
  meta,
  body,
  footer,
}) => {
  const hasCustomBackground =
    backgroundStyle && Object.keys(backgroundStyle).length > 0;

  return (
    <div
      className={`w-full p-4 min-h-screen bg-cover bg-center ${
        hasCustomBackground ? "" : backgroundClass
      }`}
      style={backgroundStyle}
    >
      <div className="mt-16 mb-8">
        <h1 className="font-creepster text-gray-200 text-6xl md:text-9xl font-bold text-center z-20 relative [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
          {title}
        </h1>
        {meta}
      </div>
      <SpotifyPlayer />
      {body && <StoryReader body={body} />}
      {footer}
    </div>
  );
};

export default StoryPageLayout;
