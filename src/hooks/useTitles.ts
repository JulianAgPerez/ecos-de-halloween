import { useCallback, useRef } from "react";
import { type Query, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllClassicTitles } from "../services/ClassicStoryService";
import { getAllStoryTitles } from "../services/StoryService";
import { classicFallbackTitles } from "../data/classicFallbackTitles";
import { fallbackTitles } from "../data/fallbackTitles";
import type { ClassicStoryTitleDTO, StoryTitleDTO } from "../types";

export const STORY_TITLES_KEY = ["story-titles"] as const;
export const CLASSIC_TITLES_KEY = ["classic-titles"] as const;

const FALLBACK_RETRY_MS = 10_000;
const MAX_FALLBACK_RETRIES = 10;

const useErrorRefetchInterval = <TData,>() => {
  const retriesLeft = useRef(MAX_FALLBACK_RETRIES);
  return useCallback(
    (query: Query<TData, Error, TData, readonly unknown[]>) => {
      if (query.state.status !== "error") return false;
      if (retriesLeft.current <= 0) return false;
      retriesLeft.current -= 1;
      return FALLBACK_RETRY_MS;
    },
    [],
  );
};

interface TitlesResult<T> {
  titles: T[];
  isLoading: boolean;
  isFallback: boolean;
  refresh: () => void;
}

const useTitles = <T>(
  query: ReturnType<typeof useQuery<T[]>>,
  queryKey: readonly unknown[],
  fallback: T[],
): TitlesResult<T> => {
  const queryClient = useQueryClient();
  const { data, isError, isSuccess, isPending } = query;
  const isFallback = isError || (isSuccess && (data?.length ?? 0) === 0);
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    titles: isFallback ? fallback : (data ?? []),
    isLoading: isPending,
    isFallback,
    refresh,
  };
};

export const useStoryTitles = (): TitlesResult<StoryTitleDTO> =>
  useTitles(
    useQuery<StoryTitleDTO[]>({
      queryKey: STORY_TITLES_KEY,
      queryFn: getAllStoryTitles,
      refetchInterval: useErrorRefetchInterval<StoryTitleDTO[]>(),
    }),
    STORY_TITLES_KEY,
    fallbackTitles,
  );

export const useClassicTitles = (): TitlesResult<ClassicStoryTitleDTO> =>
  useTitles(
    useQuery<ClassicStoryTitleDTO[]>({
      queryKey: CLASSIC_TITLES_KEY,
      queryFn: getAllClassicTitles,
      refetchInterval: useErrorRefetchInterval<ClassicStoryTitleDTO[]>(),
    }),
    CLASSIC_TITLES_KEY,
    classicFallbackTitles,
  );
