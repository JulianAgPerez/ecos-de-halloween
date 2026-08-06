import { useEffect, useRef, useState } from "react";

interface UseStoryFetchOptions<T, K> {
  key: K;
  fetch: (key: K) => Promise<T | null>;
  fallback: (key: K) => T | null;
  saveLastRead?: (story: T) => void;
}

interface UseStoryFetchResult<T> {
  story: T | null;
  isFallback: boolean;
}

const FETCH_TIMEOUT_MS = 5000;

export function useStoryFetch<T, K>(
  options: UseStoryFetchOptions<T, K>,
): UseStoryFetchResult<T> {
  const { key } = options;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [story, setStory] = useState<T | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const savedFor = useRef<T | null>(null);

  useEffect(() => {
    let active = true;
    setIsFallback(false);

    const { fetch: fetchStory, fallback } = optionsRef.current;

    const applyFallback = () => {
      const fb = fallback(key);
      if (fb) {
        setStory(fb);
        setIsFallback(true);
      }
    };

    const timeout = window.setTimeout(applyFallback, FETCH_TIMEOUT_MS);

    fetchStory(key)
      .then((data) => {
        if (!active) return;
        window.clearTimeout(timeout);
        if (data) {
          setStory(data);
          setIsFallback(false);
        } else {
          applyFallback();
        }
      })
      .catch(() => {
        if (!active) return;
        window.clearTimeout(timeout);
        applyFallback();
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [key]);

  useEffect(() => {
    const { saveLastRead } = optionsRef.current;
    if (story && saveLastRead && savedFor.current !== story) {
      savedFor.current = story;
      saveLastRead(story);
    }
  }, [story]);

  return { story, isFallback };
}
