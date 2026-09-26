import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { findAdjacent } from "../utils/adjacent";
import { withTimeout } from "../utils/withTimeout";

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
  notFound: boolean;
  isPending: boolean;
  previous: TTitle | null;
  next: TTitle | null;
  previousPath: string | null;
  nextPath: string | null;
}

interface StoryData<T> {
  story: T | null;
  isFallback: boolean;
  notFound: boolean;
}

const FETCH_TIMEOUT_MS = 5000;
const FALLBACK_RETRY_MS = 10_000;
const MAX_FALLBACK_RETRIES = 10;

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
  const retriesLeft = useRef(MAX_FALLBACK_RETRIES);

  const query = useQuery<StoryData<TStory>>({
    queryKey: ["story", basePath, key],
    enabled: Boolean(keyParam),
    retry: 1,
    refetchInterval: (query) => {
      if (retriesLeft.current <= 0) return false;
      const degraded =
        query.state.data?.isFallback === true ||
        query.state.status === "error";
      if (!degraded) return false;
      retriesLeft.current -= 1;
      return FALLBACK_RETRY_MS;
    },
    queryFn: async (): Promise<StoryData<TStory>> => {
      // null = 404 real; un throw = no se pudo consultar, va al respaldo local.
      let fetched: TStory | null = null;
      let missing = false;
      try {
        fetched = await withTimeout(fetch(key), FETCH_TIMEOUT_MS);
        missing = !fetched;
      } catch {
        missing = false;
      }

      if (fetched) return { story: fetched, isFallback: false, notFound: false };
      if (missing) return { story: null, isFallback: false, notFound: true };

      const fb = await fallback(key);
      return { story: fb, isFallback: fb !== null, notFound: false };
    },
  });

  const { story, isFallback, notFound } = query.data ?? {
    story: null,
    isFallback: false,
    notFound: false,
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
    notFound,
    isPending: query.isPending,
    previous,
    next,
    previousPath: previous ? pathFor(previous) : null,
    nextPath: next ? pathFor(next) : null,
  };
}
