import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { importDocx, DocxImportError, MAX_DOCX_BYTES } from "./DocxImportService";

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

// Sin styles.xml mammoth no puede resolver el nombre del estilo y el Heading
// degrada a párrafo: el fixture lo incluye para probar el styleMap de verdad.
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/></w:style>
</w:styles>`;

const buildDocx = async (body: string): Promise<Blob> => {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", CONTENT_TYPES);
  zip.folder("_rels")!.file(".rels", ROOT_RELS);
  const word = zip.folder("word")!;
  word.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}</w:body>
</w:document>`,
  );
  word.file("styles.xml", STYLES);
  word.folder("_rels")!.file("document.xml.rels", DOC_RELS);
  return zip.generateAsync({ type: "blob" });
};

const asFile = (blob: Blob, name: string) =>
  new File([blob], name, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

const REAL_BODY = `
  <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>El Umbral</w:t></w:r></w:p>
  <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Golpeo tres veces</w:t></w:r></w:p>
  <w:p><w:r><w:t>Nadie responde</w:t></w:r></w:p>`;

const realDocx = () => buildDocx(REAL_BODY);

describe("importDocx validacion", () => {
  it("rechaza un pdf sin intentar leerlo", async () => {
    const file = asFile(new Blob(["%PDF-1.7"]), "cuento.pdf");

    await expect(importDocx(file)).rejects.toBeInstanceOf(DocxImportError);
    await expect(importDocx(file)).rejects.toThrow(/no es un \.docx/);
  });

  it("rechaza un .doc de Word 97 por extensión", async () => {
    const file = asFile(new Blob(["binario"]), "cuento.doc");

    await expect(importDocx(file)).rejects.toThrow(/no es un \.docx/);
  });

  it("rechaza un archivo vacio", async () => {
    await expect(
      importDocx(asFile(new Blob([]), "vacio.docx")),
    ).rejects.toThrow(/vacío/);
  });

  it("rechaza un archivo que supera el tope de tamaño", async () => {
    const big = new File([new Uint8Array(MAX_DOCX_BYTES + 1)], "grande.docx");

    await expect(importDocx(big)).rejects.toThrow(/5 MB/);
  });

  it("rechaza un .docx renombrado que no es un zip", async () => {
    const fake = asFile(new Blob(["esto no es un zip"]), "falso.docx");

    await expect(importDocx(fake)).rejects.toBeInstanceOf(DocxImportError);
  });

  it("rechaza un docx valido pero sin texto", async () => {
    const empty = await buildDocx("<w:p/>");

    await expect(importDocx(asFile(empty, "blanco.docx"))).rejects.toThrow(
      /no tiene texto/,
    );
  });
});

describe("importDocx conversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("convierte un docx real conservando negrita y parrafos", async () => {
    const imported = await importDocx(asFile(await realDocx(), "cuento.docx"));

    expect(imported.html).toContain("Golpeo tres veces");
    expect(imported.html).toMatch(/<strong>.*Golpeo tres veces<\/strong>/);
    expect(imported.html).toContain("Nadie responde");
  });

  it("remapea el Heading 1 de Word a un h2 editable", async () => {
    const imported = await importDocx(asFile(await realDocx(), "cuento.docx"));

    expect(imported.html).toContain("<h2>El Umbral</h2>");
    expect(imported.html).not.toContain("<h1>");
  });

  it("devuelve el texto plano para medir el minimo de caracteres", async () => {
    const imported = await importDocx(asFile(await realDocx(), "cuento.docx"));

    expect(imported.text).toBe("El Umbral Golpeo tres veces Nadie responde");
    expect(imported.text).not.toContain("<");
  });

  it("escapa el HTML que venga incrustado en el documento", async () => {
    const hostile = await buildDocx(
      '<w:p><w:r><w:t>&lt;script&gt;alert(1)&lt;/script&gt;</w:t></w:r></w:p>',
    );
    const imported = await importDocx(asFile(hostile, "x.docx"));

    expect(imported.html).not.toContain("<script");
    expect(imported.text).toContain("alert(1)");
  });
});
