import React, { useEffect, useState } from "react";
import useSpotifyStore from "../store/UseSpotifyStore";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const SpotifyPlayer: React.FC = () => {
  const { token, setDeviceId } = useSpotifyStore();
  const [player, setPlayer] = useState<any | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);

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

      player.addListener("player_state_changed", (state: any) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
        }
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      player.connect();
      setPlayer(player);

      return () => {
        player.disconnect();
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [token, setDeviceId]);

  const handlePlayPause = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const handleNextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const handlePreviousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-md flex items-center">
      <div className="flex items-center">
        {currentTrack && (
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            className="w-16 h-16 rounded-lg"
          />
        )}
        <div className="ml-4">
          <h3 className="text-lg font-semibold">
            {currentTrack ? currentTrack.name : "Loading..."}
          </h3>
          <p className="text-sm">
            {currentTrack ? currentTrack.artists[0].name : ""}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center">
        <button onClick={handlePreviousTrack} className="p-2">
          ⏮️
        </button>
        <button onClick={handlePlayPause} className="p-2 mx-2">
          ⏯️
        </button>
        <button onClick={handleNextTrack} className="p-2">
          ⏭️
        </button>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
