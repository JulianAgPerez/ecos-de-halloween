import { create } from "zustand";

interface SoundStore {
  isPlaying: boolean;
  sounds: string[];
  activeSound: string | null;
  toggleSound: () => void;
  addSound: (sound: string) => void;
  setActiveSound: (sound: string) => void;
}

const useSoundStore = create<SoundStore>((set) => ({
  isPlaying: false,
  sounds: [],
  activeSound: null,
  toggleSound: () => set((state) => ({ isPlaying: !state.isPlaying })),
  addSound: (sound) => set((state) => ({ sounds: [...state.sounds, sound] })),
  setActiveSound: (sound) => set(() => ({ activeSound: sound })),
}));

export default useSoundStore;
