import { useCallback, useEffect, useState } from "react";

export interface StoryDraft {
  title: string;
  author: string;
  description: string;
  story: string;
}

// Versionada: cambiar la forma del borrador no debe resurrectar uno viejo con
// campos que ya no existen.
const DRAFT_KEY = "story-draft-v1";
const SAVE_DEBOUNCE_MS = 400;

const EMPTY_DRAFT: StoryDraft = {
  title: "",
  author: "",
  description: "",
  story: "",
};

const isBlankDraft = (draft: StoryDraft): boolean =>
  !draft.title.trim() &&
  !draft.author.trim() &&
  !draft.description.trim() &&
  !draft.story.trim();

const readDraft = (): StoryDraft => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<StoryDraft>;
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      author: typeof parsed.author === "string" ? parsed.author : "",
      description:
        typeof parsed.description === "string" ? parsed.description : "",
      story: typeof parsed.story === "string" ? parsed.story : "",
    };
  } catch {
    return EMPTY_DRAFT;
  }
};

interface UseStoryDraftResult {
  draft: StoryDraft;
  updateDraft: (patch: Partial<StoryDraft>) => void;
  clear: () => void;
  hasDraft: boolean;
  isRestoring: boolean;
}

export const useStoryDraft = (): UseStoryDraftResult => {
  // Lectura perezosa: el editor toma `value` una sola vez al crearse, así que
  // el borrador tiene que existir en el primer render, no después del efecto.
  const [draft, setDraft] = useState<StoryDraft>(readDraft);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    setIsRestoring(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (isBlankDraft(draft)) {
          localStorage.removeItem(DRAFT_KEY);
        } else {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        }
      } catch {
        // localStorage puede lanzar en modo privado: el borrador es un extra.
      }
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const updateDraft = useCallback((patch: Partial<StoryDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const clear = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // localStorage puede lanzar en modo privado: el borrador es un extra.
    }
  }, []);

  return { draft, updateDraft, clear, hasDraft: !isBlankDraft(draft), isRestoring };
};
