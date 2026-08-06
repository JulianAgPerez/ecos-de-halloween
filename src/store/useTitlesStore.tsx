import { create } from "zustand";
import { StoryTitleDTO, ClassicStoryTitleDTO } from "../types";
import { getAllStoryTitles } from "../services/StoryService";
import { getAllClassicTitles } from "../services/ClassicStoryService";
import { fallbackTitles } from "../data/fallbackData";
import { classicFallbackTitles } from "../data/classicFallback";

const FETCH_TIMEOUT_MS = 5000;

let storiesPromise: Promise<void> | null = null;
let classicsPromise: Promise<void> | null = null;
let storiesTimeout: number | null = null;
let classicsTimeout: number | null = null;

interface TitlesStore {
  storyTitles: StoryTitleDTO[];
  classicTitles: ClassicStoryTitleDTO[];
  isStoriesLoading: boolean;
  isClassicsLoading: boolean;
  isStoriesFallback: boolean;
  isClassicsFallback: boolean;
  fetchStoryTitles: () => Promise<void>;
  fetchClassicTitles: () => Promise<void>;
  refreshStoryTitles: () => Promise<void>;
}

const useTitlesStore = create<TitlesStore>((set, get) => {
  const runStoriesFetch = async () => {
    set({ isStoriesLoading: true });
    if (storiesTimeout !== null) window.clearTimeout(storiesTimeout);
    storiesTimeout = window.setTimeout(() => {
      if (get().storyTitles.length === 0) {
        set({
          storyTitles: fallbackTitles,
          isStoriesFallback: true,
          isStoriesLoading: false,
        });
        storiesTimeout = null;
        storiesPromise = null;
      }
    }, FETCH_TIMEOUT_MS);

    try {
      const names = await getAllStoryTitles();
      if (Array.isArray(names) && names.length > 0) {
        set({ storyTitles: names, isStoriesFallback: false });
      } else {
        set({ storyTitles: fallbackTitles, isStoriesFallback: true });
      }
    } catch {
      set({ storyTitles: fallbackTitles, isStoriesFallback: true });
    } finally {
      set({ isStoriesLoading: false });
      if (storiesTimeout !== null) {
        window.clearTimeout(storiesTimeout);
        storiesTimeout = null;
      }
      storiesPromise = null;
    }
  };

  const runClassicsFetch = async () => {
    set({ isClassicsLoading: true });
    if (classicsTimeout !== null) window.clearTimeout(classicsTimeout);
    classicsTimeout = window.setTimeout(() => {
      if (get().classicTitles.length === 0) {
        set({
          classicTitles: classicFallbackTitles,
          isClassicsFallback: true,
          isClassicsLoading: false,
        });
        classicsTimeout = null;
        classicsPromise = null;
      }
    }, FETCH_TIMEOUT_MS);

    try {
      const names = await getAllClassicTitles();
      if (Array.isArray(names) && names.length > 0) {
        set({ classicTitles: names, isClassicsFallback: false });
      } else {
        set({ classicTitles: classicFallbackTitles, isClassicsFallback: true });
      }
    } catch {
      set({ classicTitles: classicFallbackTitles, isClassicsFallback: true });
    } finally {
      set({ isClassicsLoading: false });
      if (classicsTimeout !== null) {
        window.clearTimeout(classicsTimeout);
        classicsTimeout = null;
      }
      classicsPromise = null;
    }
  };

  return {
    storyTitles: [],
    classicTitles: [],
    isStoriesLoading: true,
    isClassicsLoading: true,
    isStoriesFallback: false,
    isClassicsFallback: false,

    fetchStoryTitles: () => {
      if (get().storyTitles.length > 0) return Promise.resolve();
      if (storiesPromise) return storiesPromise;
      storiesPromise = runStoriesFetch();
      return storiesPromise;
    },

    fetchClassicTitles: () => {
      if (get().classicTitles.length > 0) return Promise.resolve();
      if (classicsPromise) return classicsPromise;
      classicsPromise = runClassicsFetch();
      return classicsPromise;
    },

    refreshStoryTitles: () => {
      if (storiesPromise) return storiesPromise;
      storiesPromise = runStoriesFetch();
      return storiesPromise;
    },
  };
});

export default useTitlesStore;
