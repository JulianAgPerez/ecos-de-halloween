import { useCallback, useMemo, useRef, useState } from "react";
import { FaMinus, FaMoon, FaPlus, FaSun } from "react-icons/fa";
import DOMPurify from "dompurify";
import ReadingProgressBar from "./ReadingProgressBar";

const MIN_FONT_SIZE = 70;
const MAX_FONT_SIZE = 160;
const FONT_SIZE_STEP = 10;
const FONT_SIZE_KEY = "reader-font-size";
const NIGHT_MODE_KEY = "reader-night-mode";

const readSavedFontSize = (): number => {
  try {
    const parsed = parseInt(localStorage.getItem(FONT_SIZE_KEY) ?? "", 10);
    return Number.isNaN(parsed) ? 100 : Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, parsed));
  } catch {
    return 100;
  }
};

const readSavedNightMode = (): boolean => {
  try {
    return localStorage.getItem(NIGHT_MODE_KEY) === "on";
  } catch {
    return false;
  }
};

// El editor no es una frontera de confianza: `POST /api/stories` es público y
// cualquiera puede mandar HTML arbitrario con curl. Acá va el allowlist.
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "del",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "hr",
  "a",
];

// Solo `href` entra: `target` y `rel` se reescriben después, para que un
// `rel="opener"` inyectado no sobreviva al allowlist.
const ALLOWED_ATTR = ["href"];

// El default de DOMPurify también acepta `tel:`, `cid:` y `xmpp:`; un cuento
// solo enlaza http(s) y mailto.
const ALLOWED_URI_REGEXP =
  /^(?:https?:|mailto:|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName !== "A") return;
  node.setAttribute("target", "_blank");
  node.setAttribute("rel", "noopener noreferrer");
});

const sanitizeBody = (body: string): string =>
  DOMPurify.sanitize(body, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    KEEP_CONTENT: true,
  });

// Los clásicos llegan como prosa plana y los cuentos nuevos como HTML. Este corte
// decide cómo se maqueta, nunca si se sanitiza: la rama de texto nunca
// interpreta HTML y la de HTML siempre pasa por DOMPurify.
const HTML_BODY_PATTERN =
  /<(p|br|h2|h3|ul|ol|li|blockquote|strong|em|b|i|s|del|code|pre|hr|a)(\s[^>]*)?\/?>/i;

const looksLikeHtml = (body: string): boolean => HTML_BODY_PATTERN.test(body);

interface StoryReaderProps {
  body: string;
}

const StoryReader = ({ body }: StoryReaderProps) => {
  // El cuerpo cambia de etiqueta según sea HTML o prosa, así que el ref se
  // resuelve por callback: un `useRef<HTMLElement>` no es asignable al `ref` de
  // un `<div>` ni al de un `<pre>` porque son tipos distintos, no superclases.
  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);
  const [fontSize, setFontSize] = useState(readSavedFontSize);
  const [nightMode, setNightMode] = useState(readSavedNightMode);
  const isHtml = looksLikeHtml(body);
  const safeBody = useMemo(() => (isHtml ? sanitizeBody(body) : ""), [
    isHtml,
    body,
  ]);

  const changeFontSize = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, prev + delta));
      try {
        localStorage.setItem(FONT_SIZE_KEY, String(next));
      } catch {
        // localStorage puede lanzar en modo privado: la preferencia es un extra.
      }
      return next;
    });
  };

  const toggleNightMode = () => {
    setNightMode((prev) => {
      try {
        localStorage.setItem(NIGHT_MODE_KEY, prev ? "off" : "on");
      } catch {
        // localStorage puede lanzar en modo privado: la preferencia es un extra.
      }
      return !prev;
    });
  };

  return (
    <section className="flex flex-col items-center px-4">
      <div className="mt-4 flex w-full max-w-3xl items-center justify-end gap-2">
        <button
          type="button"
          onClick={toggleNightMode}
          aria-label={nightMode ? "Desactivar modo nocturno" : "Activar modo nocturno"}
          aria-pressed={nightMode}
          className={`rounded-lg p-2 transition ${
            nightMode
              ? "bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
              : "bg-purple-800/40 text-gray-200 hover:bg-purple-700/60"
          }`}
        >
          {nightMode ? <FaMoon size={14} /> : <FaSun size={14} />}
        </button>
        <button
          type="button"
          onClick={() => changeFontSize(-FONT_SIZE_STEP)}
          aria-label="Reducir tamaño de letra"
          className="rounded-lg bg-purple-800/40 p-2 text-gray-200 transition hover:bg-purple-700/60"
        >
          <FaMinus size={12} />
        </button>
        <span className="w-10 text-center text-xs text-gray-300 tabular-nums" aria-live="polite">
          {fontSize}%
        </span>
        <button
          type="button"
          onClick={() => changeFontSize(FONT_SIZE_STEP)}
          aria-label="Aumentar tamaño de letra"
          className="rounded-lg bg-purple-800/40 p-2 text-gray-200 transition hover:bg-purple-700/60"
        >
          <FaPlus size={12} />
        </button>
      </div>
      <div
        className={`note-background mt-2 w-full max-w-3xl text-left ${
          nightMode ? "night-mode" : ""
        }`}
      >
        <ReadingProgressBar targetRef={ref} nightMode={nightMode} />
        {isHtml ? (
          <div
            ref={setRef}
            className="story-body"
            style={{ fontSize: `${fontSize}%` }}
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        ) : (
          <pre
            ref={setRef}
            className="text-lg leading-relaxed sm:text-xl"
            style={{ fontSize: `${fontSize}%` }}
          >
            {body}
          </pre>
        )}
      </div>
    </section>
  );
};

export default StoryReader;
