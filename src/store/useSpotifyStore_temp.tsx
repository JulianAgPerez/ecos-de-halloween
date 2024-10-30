import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface SpotifyState {
  token: string;
  deviceId: string | null;
  playlistId: string;
  setToken: (token: string) => void;
  setDeviceId: (deviceId: string) => void;
  setPlaylistId: (playlistId: string) => void;
}

const useSpotifyStore = create<SpotifyState>(
  devtools((set) => ({
    token: "",
    deviceId: null,
    playlistId: "7q9TpbY2TtoZYJqeH2pT4e",
    setToken: (token: string) => set({ token }),
    setDeviceId: (deviceId: string) => set({ deviceId }),
    setPlaylistId: (playlistId: string) => set({ playlistId }),
  })) as unknown as StateCreator<SpotifyState>
);

export default useSpotifyStore;
