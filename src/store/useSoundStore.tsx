import { create } from "zustand";

interface SoundStore {
  isPlaying: boolean;
  sounds: string[];
  toggleSound: () => void;
  addSound: (sound: string) => void;
}

const useSoundStore = create<SoundStore>((set) => ({
  isPlaying: false,
  sounds: [],
  toggleSound: () => set((state) => ({ isPlaying: !state.isPlaying })),
  addSound: (sound) => set((state) => ({ sounds: [...state.sounds, sound] })),
}));

export default useSoundStore;
