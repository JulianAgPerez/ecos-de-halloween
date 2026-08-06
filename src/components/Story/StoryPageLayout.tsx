import { FC, ReactNode } from "react";
import SpotifyPlayer from "../SpotifyPlayer";
import StoryReader from "./StoryReader";
import StoryBackground from "./StoryBackground";

interface StoryPageLayoutProps {
  title: string;
  backgroundImageUrl?: string;
  backgroundClass?: string;
  meta?: ReactNode;
  body?: string;
  footer?: ReactNode;
}

const StoryPageLayout: FC<StoryPageLayoutProps> = ({
  title,
  backgroundImageUrl,
  backgroundClass = "bg-home-principal",
  meta,
  body,
  footer,
}) => {
  return (
    <div className="relative w-full min-h-screen p-4">
      <StoryBackground
        imageUrl={backgroundImageUrl}
        fallbackBgClass={backgroundClass}
      />
      <div className="relative z-10">
        <div className="mt-16 mb-8">
          <h1 className="font-creepster text-gray-200 text-6xl md:text-9xl font-bold text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
            {title}
          </h1>
          {meta}
        </div>
        <SpotifyPlayer />
        {body && <StoryReader body={body} />}
        {footer}
      </div>
    </div>
  );
};

export default StoryPageLayout;
