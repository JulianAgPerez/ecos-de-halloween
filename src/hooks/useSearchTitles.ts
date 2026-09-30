import { useMemo, useState } from "react";
import { ClassicStoryTitleDTO, StoryTitleDTO } from "../types";
import { sortByTitle } from "../utils/sortTitles";

interface SearchTitlesResult {
  query: string;
  setQuery: (q: string) => void;
  filteredStories: StoryTitleDTO[];
  filteredCommunity: StoryTitleDTO[];
  filteredClassics: ClassicStoryTitleDTO[];
  hasQuery: boolean;
}

export function useSearchTitles(
  stories: StoryTitleDTO[],
  classics: ClassicStoryTitleDTO[],
): SearchTitlesResult {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const filteredStories = useMemo(() => {
    const sorted = sortByTitle(stories).filter((story) => story.mine);
    if (!hasQuery) return sorted;
    return sorted.filter((story) =>
      story.title.toLowerCase().includes(normalizedQuery),
    );
  }, [stories, normalizedQuery, hasQuery]);

  const filteredCommunity = useMemo(() => {
    const sorted = sortByTitle(stories).filter((story) => !story.mine);
    if (!hasQuery) return sorted;
    return sorted.filter((story) =>
      story.title.toLowerCase().includes(normalizedQuery),
    );
  }, [stories, normalizedQuery, hasQuery]);

  const filteredClassics = useMemo(() => {
    const sorted = sortByTitle(classics);
    if (!hasQuery) return sorted;
    return sorted.filter(
      (classic) =>
        classic.title.toLowerCase().includes(normalizedQuery) ||
        classic.author.toLowerCase().includes(normalizedQuery),
    );
  }, [classics, normalizedQuery, hasQuery]);

  return {
    query,
    setQuery,
    filteredStories,
    filteredCommunity,
    filteredClassics,
    hasQuery,
  };
}