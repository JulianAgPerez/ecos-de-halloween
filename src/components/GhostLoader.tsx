import { FC } from "react";

const GhostLoader: FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-custom-purple">
      <div className="ghost-loader">
        <div className="ghost">
          <div className="face"></div>
        </div>
        <div className="shadow"></div>
      </div>
    </div>
  );
};

export default GhostLoader;
