import React from "react";

const PLAYLIST_ID = "7q9TpbY2TtoZYJqeH2pT4e";

const SpotifyPlayer: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mx-auto w-80">
      <h2 className="text-lg font-semibold">Playlist sugerida</h2>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`}
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
