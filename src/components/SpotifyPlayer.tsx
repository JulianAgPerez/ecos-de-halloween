import { FC } from "react";
import { SPOTIFY_PLAYLIST_ID } from "../config";

const SpotifyPlayer: FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mx-auto w-80">
      <h2 className="text-lg font-semibold">Playlist sugerida</h2>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}`}
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
        title="Spotify Player"
        className="rounded-md"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;
