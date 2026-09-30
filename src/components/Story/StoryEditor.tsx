import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaStrikethrough,
} from "react-icons/fa";

export interface StoryTextStats {
  chars: number;
  words: number;
}

interface StoryEditorProps {
  value: string;
  onChange: (html: string) => void;
  onTextStatsChange: (stats: StoryTextStats) => void;
  editorRef: MutableRefObject<Editor | null>;
  onBlur?: () => void;
  disabled?: boolean;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-invalid"?: boolean;
}

const TOOLBAR_CLASS =
  "mb-2 flex flex-wrap items-center gap-1 bg-gray-900 border border-purple-800 rounded-t p-2";
const BUTTON_CLASS =
  "rounded p-2 text-amber-400 transition hover:bg-purple-800/40 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed";
const ACTIVE_BUTTON_CLASS = "bg-purple-800/60 text-amber-300";
const HEADING_LABEL_CLASS =
  "font-semibold text-[0.7rem] leading-none tracking-tight";

const readStats = (editor: Editor): StoryTextStats => {
  const text = editor.getText().trim();
  const chars = text.length;
  return { chars, words: chars === 0 ? 0 : text.split(/\s+/).length };
};

interface ToolbarButtonProps {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

const ToolbarButton = ({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    // `aria-label` solo lo leen los lectores de pantalla: sin `title` el mouse
    // no tiene forma de saber qué hace el botón.
    title={label}
    aria-pressed={active}
    // Sin preventDefault el mousedown mueve el foco y la selección del editor se
    // pierde antes de que el comando del click llegue a correr.
    onMouseDown={(e: ReactMouseEvent<HTMLButtonElement>) => e.preventDefault()}
    className={`${BUTTON_CLASS}${active ? ` ${ACTIVE_BUTTON_CLASS}` : ""}`}
  >
    {children}
  </button>
);

const StoryEditor = ({
  value,
  onChange,
  onTextStatsChange,
  editorRef,
  onBlur,
  disabled = false,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid = false,
}: StoryEditorProps) => {
  // `value` llega por props y el editor notifica por callback: sin este eco el
  // efecto compararía contra un estado viejo y pisaría el cursor en cada tecla.
  const lastEmitted = useRef(value);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "story-surface", id: "story-editor" },
    },
    onCreate: ({ editor: instance }) => {
      editorRef.current = instance;
      lastEmitted.current = instance.getHTML();
      onTextStatsChange(readStats(instance));
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      lastEmitted.current = html;
      onChange(html);
      onTextStatsChange(readStats(instance));
    },
    onBlur: () => onBlur?.(),
  });

  // `aria-pressed` de la barra tiene que reflejar el cursor aunque el editor
  // no dispare transacciones.
  const toolbar = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      isEmpty: instance === null || instance.isEmpty,
      bold: instance?.isActive("bold") ?? false,
      italic: instance?.isActive("italic") ?? false,
      strike: instance?.isActive("strike") ?? false,
      h2: instance?.isActive("heading", { level: 2 }) ?? false,
      h3: instance?.isActive("heading", { level: 3 }) ?? false,
      bulletList: instance?.isActive("bulletList") ?? false,
      orderedList: instance?.isActive("orderedList") ?? false,
      blockquote: instance?.isActive("blockquote") ?? false,
    }),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);

  useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(value, { emitUpdate: false });
    onTextStatsChange(readStats(editor));
  }, [editor, value, onTextStatsChange]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  // El elemento editable lo crea ProseMirror, fuera del árbol de React: los
  // atributos de error se le escriben al DOM directamente.
  useEffect(() => {
    if (!editor) return;
    const { dom } = editor.view;
    if (ariaInvalid) {
      dom.setAttribute("aria-invalid", "true");
    } else {
      dom.removeAttribute("aria-invalid");
    }
    if (ariaDescribedBy) {
      dom.setAttribute("aria-describedby", ariaDescribedBy);
    } else {
      dom.removeAttribute("aria-describedby");
    }
    if (ariaLabelledBy) {
      dom.setAttribute("aria-labelledby", ariaLabelledBy);
    } else {
      dom.removeAttribute("aria-labelledby");
    }
  }, [editor, ariaInvalid, ariaDescribedBy, ariaLabelledBy]);

  if (!editor || !toolbar) {
    return (
      <div
        className="h-64 animate-pulse rounded-b-lg bg-gray-900"
        aria-hidden="true"
      />
    );
  }

  const chain = () => editor.chain().focus();
  const wrapperClass = [
    toolbar.isEmpty ? "story-editor--empty" : "",
    disabled ? "opacity-60" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <div
        role="toolbar"
        aria-label="Formato del texto"
        aria-controls="story-editor"
        className={TOOLBAR_CLASS}
      >
        <ToolbarButton
          label="Negrita"
          active={toolbar.bold}
          disabled={disabled}
          onClick={() => chain().toggleBold().run()}
        >
          <FaBold />
        </ToolbarButton>
        <ToolbarButton
          label="Cursiva"
          active={toolbar.italic}
          disabled={disabled}
          onClick={() => chain().toggleItalic().run()}
        >
          <FaItalic />
        </ToolbarButton>
        <ToolbarButton
          label="Tachado"
          active={toolbar.strike}
          disabled={disabled}
          onClick={() => chain().toggleStrike().run()}
        >
          <FaStrikethrough />
        </ToolbarButton>
        <ToolbarButton
          label="Encabezado 2"
          active={toolbar.h2}
          disabled={disabled}
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        >
          <span className={HEADING_LABEL_CLASS}>H2</span>
        </ToolbarButton>
        <ToolbarButton
          label="Encabezado 3"
          active={toolbar.h3}
          disabled={disabled}
          onClick={() => chain().toggleHeading({ level: 3 }).run()}
        >
          <span className={HEADING_LABEL_CLASS}>H3</span>
        </ToolbarButton>
        <ToolbarButton
          label="Lista con viñetas"
          active={toolbar.bulletList}
          disabled={disabled}
          onClick={() => chain().toggleBulletList().run()}
        >
          <FaListUl />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          active={toolbar.orderedList}
          disabled={disabled}
          onClick={() => chain().toggleOrderedList().run()}
        >
          <FaListOl />
        </ToolbarButton>
        <ToolbarButton
          label="Cita"
          active={toolbar.blockquote}
          disabled={disabled}
          onClick={() => chain().toggleBlockquote().run()}
        >
          <FaQuoteLeft />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default StoryEditor;
