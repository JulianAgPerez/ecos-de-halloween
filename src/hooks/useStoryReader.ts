import { useMemo } from "react";
import { findAdjacent } from "../utils/adjacent";
import { useStoryFetch } from "./useStoryFetch";

interface StoryReaderOptions<TStory, TTitle extends { title: string }> {
  keyParam: string | undefined;
  fetch: (key: string) => Promise<TStory | null>;
  fallback: (key: string) => TStory | null;
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
  const { story, isFallback } = useStoryFetch<TStory, string>({
    key,
    fetch,
    fallback,
    saveLastRead: save,
  });

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