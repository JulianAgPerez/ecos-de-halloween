import { create } from "zustand";

interface SoundState {
  isPlaying: boolean;
  toggleSound: () => void;
}

const useSoundStore = create<SoundState>((set) => ({
  isPlaying: false,
  toggleSound: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

export default useSoundStore;
