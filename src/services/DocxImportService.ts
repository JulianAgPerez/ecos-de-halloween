export const MAX_DOCX_BYTES = 5 * 1024 * 1024;

export interface DocxImport {
  html: string;
  text: string;
  messages: string[];
}

const STYLE_MAP = [
  "p[style-name='Title'] => h2:fresh",
  "p[style-name='Subtitle'] => h3:fresh",
  "p[style-name='Heading 1'] => h2:fresh",
  "p[style-name='Heading 2'] => h3:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
];

export class DocxImportError extends Error {}

export const importDocx = async (file: File): Promise<DocxImport> => {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    throw new DocxImportError(
      "Ese archivo no es un .docx. Exportá tu documento como .docx e intentá de nuevo.",
    );
  }
  if (file.size === 0) {
    throw new DocxImportError("El archivo está vacío.");
  }
  if (file.size > MAX_DOCX_BYTES) {
    throw new DocxImportError("El archivo supera los 5 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();

  let result: { value: string; messages: { message: string }[] };
  try {
    const { default: mammoth } = await import("mammoth");
    const input = {
      arrayBuffer,
      buffer: arrayBuffer,
    } as unknown as Parameters<typeof mammoth.convertToHtml>[0];
    result = await mammoth.convertToHtml(input, { styleMap: STYLE_MAP });
  } catch {
    throw new DocxImportError(
      "El archivo está dañado o no es un .docx válido.",
    );
  }

  if (!result.value.trim()) {
    throw new DocxImportError("El documento no tiene texto para importar.");
  }

  return {
    html: result.value,
    text: result.value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    messages: result.messages.map((m) => m.message),
  };
};
