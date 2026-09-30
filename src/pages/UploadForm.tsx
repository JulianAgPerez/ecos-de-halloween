import {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { Editor } from "@tiptap/react";
import { submitStory } from "../services/StorySubmissionService";
import {
  importDocx,
  DocxImportError,
  MAX_DOCX_BYTES,
} from "../services/DocxImportService";
import { useSeo } from "../hooks/useSeo";
import { useStoryDraft } from "../hooks/useStoryDraft";
import AnimatedBackground from "../components/AnimatedBackground";
import StoryEditor, { type StoryTextStats } from "../components/Story/StoryEditor";

const ERROR_ID = "upload-error";
const SUCCESS_ID = "upload-success";
const TITLE_ERROR_ID = "title-error";
const STORY_ERROR_ID = "story-error";
const COPYRIGHT_ERROR_ID = "copyright-error";
const RULES_ERROR_ID = "rules-error";
const TITLE_HINT_ID = "title-hint";
const STORY_HINT_ID = "story-hint";

const MAX_TITLE = 120;
const MAX_AUTHOR = 255;
const MAX_DESCRIPTION = 255;
const MIN_STORY_CHARS = 500;

const inputClass =
  "w-full p-2 bg-gray-900 border border-purple-800 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-400 disabled:opacity-50";
const submitClass =
  "w-full bg-gradient-to-br from-purple-600 to-purple-900 text-amber-400 px-4 py-2 rounded hover:from-purple-700 hover:to-purple-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
const labelClass = "block text-gray-300 mb-2";
const fieldErrorClass = "text-sm text-red-400 mt-1";
const hintClass = "mt-1 text-xs text-gray-500";

type FieldKey = "title" | "story" | "copyright" | "rules";
type FieldErrors = Partial<Record<FieldKey, string>>;

const storyError = (chars: number): string =>
  `El cuento necesita al menos ${MIN_STORY_CHARS} caracteres. Te faltan ${
    MIN_STORY_CHARS - chars
  }.`;

const TITLE_ERROR = "El título es obligatorio.";
const COPYRIGHT_ERROR = "Tenés que declarar que este cuento es de tu autoría.";
const RULES_ERROR = "Tenés que aceptar las reglas de la comunidad.";

const UploadForm: FC = () => {
  const { draft, updateDraft, clear, hasDraft, isRestoring } = useStoryDraft();
  const [stats, setStats] = useState<StoryTextStats>({ chars: 0, words: 0 });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [copyright, setCopyright] = useState(false);
  const [rules, setRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNote, setImportNote] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const copyrightRef = useRef<HTMLInputElement>(null);
  const rulesRef = useRef<HTMLInputElement>(null);

  // `noindex` y no un `Disallow` en robots.txt: el crawler tiene que poder
  // bajarla para leer el meta, y bloquearla es lo que hace que no se vea.
  useSeo({
    title: "Contanos tu terror",
    description:
      "Escribí tu cuento de terror y compartilo con todos. No hace falta registro.",
    noindex: true,
  });

  const focusTargets: Record<FieldKey, () => HTMLElement | null> = {
    title: () => titleRef.current,
    story: () => editorRef.current?.view.dom ?? null,
    copyright: () => copyrightRef.current,
    rules: () => rulesRef.current,
  };

  const fieldError = (key: FieldKey, chars: number): string | undefined => {
    if (key === "title") return draft.title.trim() ? undefined : TITLE_ERROR;
    if (key === "story") {
      return chars < MIN_STORY_CHARS ? storyError(chars) : undefined;
    }
    if (key === "copyright") return copyright ? undefined : COPYRIGHT_ERROR;
    return rules ? undefined : RULES_ERROR;
  };

  // Validar todo en el primer blur carpetaría con errores lo que el autor
  // todavía ni tocó.
  const touchField = (key: FieldKey) =>
    setFieldErrors((prev) => ({ ...prev, [key]: fieldError(key, stats.chars) }));

  const clearFieldError = (key: FieldKey) =>
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const hasUnsavedContent =
    !sent &&
    (draft.title.trim() !== "" ||
      draft.description.trim() !== "" ||
      draft.story.trim() !== "");

  useEffect(() => {
    if (!hasUnsavedContent) return;
    const warnOnExit = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnOnExit);
    return () => window.removeEventListener("beforeunload", warnOnExit);
  }, [hasUnsavedContent]);

  const showSuccess = (id: number | null) => {
    clear();
    setCreatedId(id);
    setSent(true);
    setFieldErrors({});
    setError(null);
    window.dispatchEvent(new CustomEvent("stories-updated"));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Trampa para bots: se responde como si nada, sin POST ni mensaje de error,
    // para que no aprenda a completar el campo oculto.
    if (honeypot.trim()) {
      showSuccess(null);
      return;
    }

    const chars = editorRef.current?.getText().trim().length ?? 0;
    const keys: FieldKey[] = ["title", "story", "copyright", "rules"];
    const nextErrors: FieldErrors = {};
    for (const key of keys) {
      const message = fieldError(key, chars);
      if (message) nextErrors[key] = message;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      for (const key of keys) {
        if (!nextErrors[key]) continue;
        focusTargets[key]()?.focus();
        break;
      }
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const created = await submitStory({
        title: draft.title.trim(),
        body: draft.story,
        description: draft.description.trim() || undefined,
        author: draft.author.trim() || undefined,
      });
      showSuccess(created.id ?? null);
    } catch {
      setError("No pudimos guardar tu cuento. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clear();
    setStats({ chars: 0, words: 0 });
    setCopyright(false);
    setRules(false);
    setCreatedId(null);
    setSent(false);
    setFieldErrors({});
    setError(null);
    setImportError(null);
    setImportNote(null);
  };

  // Importar borra lo que haya en el editor, así que sobre contenido escrito
  // se pregunta: perder trabajo sin aviso es peor que un confirm de más.
  const handleDocxImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    // Vaciar el value permite reelegir el mismo archivo: si no, el change no
    // vuelve a disparar porque el valor no cambió.
    input.value = "";
    if (!file) return;

    setImportError(null);
    setImportNote(null);

    if (
      draft.story.trim() !== "" &&
      !window.confirm(
        "Ya hay texto en el editor. Importar el documento lo reemplaza. ¿Seguimos?",
      )
    ) {
      return;
    }

    setImporting(true);
    try {
      const imported = await importDocx(file);
      updateDraft({ story: imported.html });
      setImportNote(
        imported.messages.length > 0
          ? `Importamos tu documento, pero ${imported.messages.length} elemento(s) usaban un formato que el editor no tiene y quedaron como texto simple.`
          : "Importamos tu documento. Revisalo y seguí editándolo acá.",
      );
    } catch (error) {
      setImportError(
        error instanceof DocxImportError
          ? error.message
          : "No pudimos importar el documento.",
      );
    } finally {
      setImporting(false);
    }
  };

  if (sent) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <AnimatedBackground />
        <div
          id={SUCCESS_ID}
          role="status"
          className="relative z-10 w-full max-w-lg bg-custom-purple/95 border border-purple-700 shadow-2xl rounded-lg p-8 text-center"
        >
          <h1 className="font-creepster text-4xl text-amber-400 mb-4">
            ¡Gracias por compartir tu terror!
          </h1>
          <p className="text-gray-300 mb-2">
            Tu cuento ya está publicado.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            No hay paso de moderación ni cola de revisión: apenas lo envías queda
            visible para cualquiera que entre al sitio.
          </p>
          <div className="flex flex-col gap-3">
            {createdId !== null && (
              <Link to={`/story/${createdId}`} className={submitClass}>
                Leer tu cuento
              </Link>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="w-full border border-purple-800 rounded px-4 py-2 text-gray-300 transition hover:border-amber-400 hover:text-amber-300"
            >
              Escribir otro cuento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        noValidate
        className="relative z-10 w-full max-w-2xl bg-custom-purple/95 border border-purple-700 shadow-2xl rounded-lg p-8"
      >
        <h1 className="font-creepster text-4xl text-amber-400 text-center mb-2">
          Contanos tu terror
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          Podés publicar sin registro. Si querés que figure tu nombre, escribilo
          abajo.
        </p>

        {error && (
          <p id={ERROR_ID} role="alert" className="text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        {hasDraft && !isRestoring && (
          <p role="status" className="text-amber-300 text-center text-sm mb-4">
            Recuperamos el borrador que habías empezado.
          </p>
        )}

        <div className="mb-4">
          <label className={labelClass} htmlFor="title">
            Título
          </label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            name="title"
            placeholder="Título del cuento"
            value={draft.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              updateDraft({ title: e.target.value });
              clearFieldError("title");
            }}
            onBlur={() => touchField("title")}
            maxLength={MAX_TITLE}
            autoComplete="off"
            aria-invalid={fieldErrors.title ? true : undefined}
            aria-describedby={`${TITLE_HINT_ID}${
              fieldErrors.title ? ` ${TITLE_ERROR_ID}` : ""
            }`}
            disabled={loading}
            className={inputClass}
            required
          />
          <p id={TITLE_HINT_ID} className={hintClass}>
            {draft.title.length}/{MAX_TITLE} caracteres.
          </p>
          {fieldErrors.title && (
            <p id={TITLE_ERROR_ID} role="alert" className={fieldErrorClass}>
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className={labelClass} htmlFor="author">
            Autoría (opcional)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="Anónimo (opcional)"
            value={draft.author}
            onChange={(e) => updateDraft({ author: e.target.value })}
            maxLength={MAX_AUTHOR}
            autoComplete="off"
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="mb-4">
          <label className={labelClass} htmlFor="description">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Una línea que invite a leerlo."
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
            maxLength={MAX_DESCRIPTION}
            autoComplete="off"
            disabled={loading}
            className={inputClass}
            rows={2}
          />
        </div>

        <div className="mb-4">
          <span className={labelClass} id="story-label">
            Tu cuento
          </span>
          <div className="mb-3 rounded border border-dashed border-purple-700 bg-gray-900/40 p-3">
            <label
              className="block text-sm text-gray-300 mb-2"
              htmlFor="docx"
            >
              ¿Ya lo tenés escrito? Traelo desde Word
            </label>
            <input
              type="file"
              id="docx"
              name="docx"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleDocxImport}
              disabled={importing || loading}
              aria-describedby="docx-hint"
              className="block w-full text-sm text-gray-400 file:mr-3 file:px-3 file:py-2 file:rounded file:border-0 file:bg-purple-700 file:text-amber-400 file:cursor-pointer file:text-xs hover:file:bg-purple-800 disabled:opacity-50"
            />
            <p id="docx-hint" className={hintClass}>
              Solo .docx, hasta {MAX_DOCX_BYTES / 1024 / 1024} MB. Se lee en tu
              navegador y no se sube a ningún servidor.
            </p>
            {importing && (
              <p role="status" className={hintClass}>
                Leyendo el documento…
              </p>
            )}
            {importError && (
              <p role="alert" className={fieldErrorClass}>
                {importError}
              </p>
            )}
            {importNote && (
              <p
                role="status"
                className="text-xs text-amber-300 mt-1"
              >
                {importNote}
              </p>
            )}
          </div>
          <StoryEditor
            value={draft.story}
            onChange={(html) => updateDraft({ story: html })}
            onTextStatsChange={setStats}
            editorRef={editorRef}
            onBlur={() => touchField("story")}
            disabled={loading}
            aria-invalid={fieldErrors.story ? true : undefined}
            aria-labelledby="story-label"
            aria-describedby={`${STORY_HINT_ID}${
              fieldErrors.story ? ` ${STORY_ERROR_ID}` : ""
            }`}
          />
          <p id={STORY_HINT_ID} className={hintClass}>
            {stats.chars} caracteres y {stats.words} palabras. Mínimo{" "}
            {MIN_STORY_CHARS}.
          </p>
          {fieldErrors.story && (
            <p id={STORY_ERROR_ID} role="alert" className={fieldErrorClass}>
              {fieldErrors.story}
            </p>
          )}
        </div>

        <fieldset className="mb-4">
          <legend className="text-gray-300 mb-2">Antes de enviar</legend>
          <div className="mb-3 flex items-start gap-3">
            <input
              ref={copyrightRef}
              type="checkbox"
              id="copyright"
              name="copyright"
              checked={copyright}
              onChange={(e) => {
                setCopyright(e.target.checked);
                clearFieldError("copyright");
              }}
              aria-invalid={fieldErrors.copyright ? true : undefined}
              aria-describedby={
                fieldErrors.copyright ? COPYRIGHT_ERROR_ID : undefined
              }
              disabled={loading}
              className="mt-1 h-4 w-4 shrink-0 accent-amber-400"
            />
            <div>
              <label htmlFor="copyright" className="text-sm text-gray-200">
                Declaro que este cuento es de mi autoría.
              </label>
              {fieldErrors.copyright && (
                <p
                  id={COPYRIGHT_ERROR_ID}
                  role="alert"
                  className={fieldErrorClass}
                >
                  {fieldErrors.copyright}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <input
              ref={rulesRef}
              type="checkbox"
              id="rules"
              name="rules"
              checked={rules}
              onChange={(e) => {
                setRules(e.target.checked);
                clearFieldError("rules");
              }}
              aria-invalid={fieldErrors.rules ? true : undefined}
              aria-describedby={fieldErrors.rules ? RULES_ERROR_ID : undefined}
              disabled={loading}
              className="mt-1 h-4 w-4 shrink-0 accent-amber-400"
            />
            <div>
              <label htmlFor="rules" className="text-sm text-gray-200">
                Acepto las reglas de la comunidad: nada de odio ni de violencia
                contra personas reales.
              </label>
              {fieldErrors.rules && (
                <p id={RULES_ERROR_ID} role="alert" className={fieldErrorClass}>
                  {fieldErrors.rules}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* `sr-only` + `tabIndex={-1}` + `aria-hidden` le sacan la trampa a los
            que buscan por etiqueta, al recorrido de foco y al árbol de a11y. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="company">Compañía</label>
          <input
            type="text"
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"
              />
              Enviando...
            </span>
          ) : (
            "Enviar mi cuento"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
