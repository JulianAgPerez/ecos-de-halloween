import React, { useEffect } from "react";
import useSpotifyStore from "../store/UseSpotifyStore";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const SpotifyPlayer: React.FC = () => {
  const { token, setDeviceId, playlistId } = useSpotifyStore();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        console.log("Ready with Device ID", device_id);
      });

      player.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [token, setDeviceId]);

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold">Spotify Player</h2>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
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
