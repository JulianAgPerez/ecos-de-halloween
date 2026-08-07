import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { findAdjacent } from "../utils/adjacent";

interface StoryReaderOptions<TStory, TTitle extends { title: string }> {
  keyParam: string | undefined;
  fetch: (key: string) => Promise<TStory | null>;
  fallback: (key: string) => Promise<TStory | null>;
  useTitles: () => { titles: TTitle[] };
  getTitleKey: (title: TTitle) => string;
  basePath: string;
  save: (story: TStory) => void;
}

interface StoryReaderResult<TStory, TTitle> {
  story: TStory | null;
  isFallback: boolean;
  previous: TTitle | null;
  next: TTitle | null;
  previousPath: string | null;
  nextPath: string | null;
}

interface StoryData<T> {
  story: T | null;
  isFallback: boolean;
}

const FETCH_TIMEOUT_MS = 5000;

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);

export function useStoryReader<TStory, TTitle extends { title: string }>({
  keyParam,
  fetch,
  fallback,
  useTitles,
  getTitleKey,
  basePath,
  save,
}: StoryReaderOptions<TStory, TTitle>): StoryReaderResult<TStory, TTitle> {
  const key = keyParam ?? "";
  const { titles } = useTitles();

  const query = useQuery<StoryData<TStory>>({
    queryKey: ["story", basePath, key],
    enabled: Boolean(keyParam),
    retry: 1,
    queryFn: async () => {
      let fetched: TStory | null = null;
      try {
        fetched = await withTimeout(fetch(key), FETCH_TIMEOUT_MS);
      } catch {
        fetched = null;
      }
      if (fetched) {
        return { story: fetched, isFallback: false };
      }
      const fb = await fallback(key);
      return { story: fb ?? null, isFallback: fb !== null };
    },
  });

  const { story, isFallback } = query.data ?? {
    story: null,
    isFallback: false,
  };

  const savedFor = useRef<TStory | null>(null);
  useEffect(() => {
    if (story && savedFor.current !== story) {
      savedFor.current = story;
      save(story);
    }
  }, [story, save]);

  const { previous, next } = useMemo(
    () => findAdjacent(titles, key, getTitleKey),
    [titles, key, getTitleKey],
  );

  const pathFor = (title: TTitle) => `${basePath}/${getTitleKey(title)}`;

  return {
    story,
    isFallback,
    previous,
    next,
    previousPath: previous ? pathFor(previous) : null,
    nextPath: next ? pathFor(next) : null,
  };
}