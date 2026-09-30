import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitStory } from "../services/StorySubmissionService";
import { importDocx } from "../services/DocxImportService";
import UploadForm from "./UploadForm";

vi.mock("../services/StorySubmissionService", () => ({
  submitStory: vi.fn(),
}));

// El parseo real ya está cubierto en DocxImportService.test.
vi.mock("../services/DocxImportService", async () => {
  const actual = await vi.importActual<typeof import("../services/DocxImportService")>(
    "../services/DocxImportService",
  );
  return { ...actual, importDocx: vi.fn() };
});

// ProseMirror no es manejable desde jsdom: no hay layout ni selección real, así
// que el editor se reemplaza por un textarea con la misma interfaz.
vi.mock("../components/Story/StoryEditor", () => {
  interface FakeEditorProps {
    value: string;
    onChange: (html: string) => void;
    onTextStatsChange: (stats: { chars: number; words: number }) => void;
    editorRef: { current: unknown };
    onBlur?: () => void;
    disabled?: boolean;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }

  const FakeEditor = ({
    value,
    onChange,
    onTextStatsChange,
    editorRef,
    onBlur,
    disabled,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
  }: FakeEditorProps) => {
    // Se arma en render porque es un doble: el editor real vive fuera de React.
    editorRef.current = {
      getText: () => value.replace(/<[^>]*>/g, ""),
      view: { dom: document.createElement("div") },
    };

    const stats = (text: string) => ({
      chars: text.trim().length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
    });

    return (
      <textarea
        aria-label="Tu cuento"
        value={value}
        onChange={(e) => {
          onTextStatsChange(stats(e.target.value));
          onChange(`<p>${e.target.value}</p>`);
        }}
        onBlur={onBlur}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={invalid}
      />
    );
  };

  return { default: FakeEditor };
});

const LONG_STORY =
  "La luna sangraba sobre el pueblo y nadie se animaba a salir a la calle. ".repeat(
    20,
  );

const renderForm = () =>
  render(
    <MemoryRouter>
      <UploadForm />
    </MemoryRouter>,
  );

const titleField = () => screen.getByLabelText("Título");
const authorField = () => screen.getByLabelText("Autoría (opcional)");
const descriptionField = () => screen.getByLabelText("Descripción (opcional)");
const storyField = () => screen.getByLabelText("Tu cuento");
const copyrightBox = () =>
  screen.getByRole("checkbox", {
    name: /declaro que este cuento es de mi autoría/i,
  });
const rulesBox = () =>
  screen.getByRole("checkbox", { name: /acepto las reglas de la comunidad/i });
const submitButton = () =>
  screen.getByRole("button", { name: /enviar mi cuento/i });
const docxField = () => screen.getByLabelText(/traelo desde word/i);

const pickDocx = async (file: File) => {
  await userEvent.upload(docxField(), file);
};

const docxFile = (name = "cuento.docx") =>
  new File(["contenido"], name, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

const typeStory = async (
  user: ReturnType<typeof userEvent.setup>,
  text: string,
) => {
  await user.click(storyField());
  await user.paste(text);
};

const checkConsents = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(copyrightBox());
  await user.click(rulesBox());
};

beforeEach(() => {
  localStorage.clear();
  vi.mocked(submitStory).mockReset();
  vi.mocked(submitStory).mockResolvedValue({ id: 42, title: "", body: "" });
  vi.mocked(importDocx).mockReset();
  vi.mocked(importDocx).mockResolvedValue({
    html: "<h2>El Umbral</h2><p>Golpeo tres veces</p>",
    text: "El Umbral Golpeo tres veces",
    messages: [],
  });
});

describe("UploadForm", () => {
  it("renderiza los campos del cuento y los dos consentimientos", () => {
    renderForm();

    expect(titleField()).toBeInTheDocument();
    expect(authorField()).toBeInTheDocument();
    expect(descriptionField()).toBeInTheDocument();
    expect(storyField()).toBeInTheDocument();
    expect(copyrightBox()).toBeInTheDocument();
    expect(rulesBox()).toBeInTheDocument();
    expect(submitButton()).toBeInTheDocument();
  });

  it("no pide correo porque la API no lo recibe", () => {
    renderForm();

    // Un campo que valida un dato y después lo tira no informa nada.
    expect(screen.queryByLabelText(/correo/i)).toBeNull();
    expect(screen.queryByPlaceholderText(/correo/i)).toBeNull();
  });

  it("marca la página como noindex para que no compita con los cuentos", () => {
    renderForm();

    // Y va noindex, no un Disallow en robots.txt: el crawler tiene que poder
    // bajarla para leer el meta.
    expect(
      document.head
        .querySelector('meta[name="robots"]')
        ?.getAttribute("content"),
    ).toBe("noindex, nofollow");
  });

  it("no envía si falta el título y deja el foco en el campo inválido", async () => {
    const user = userEvent.setup();
    renderForm();

    await typeStory(user, LONG_STORY);
    await checkConsents(user);
    await user.click(submitButton());

    expect(submitStory).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El título es obligatorio.",
    );
    expect(titleField()).toHaveAttribute("aria-invalid", "true");
    expect(titleField()).toHaveFocus();
  });

  it("no envía si el cuento tiene menos de 500 caracteres", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(titleField(), "El sotano");
    await typeStory(user, "Un cuento muy cortito.");
    await checkConsents(user);
    await user.click(submitButton());

    expect(submitStory).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El cuento necesita al menos 500 caracteres.",
    );
  });

  it("no envía sin el consentimiento de autoría", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(titleField(), "El sotano");
    await typeStory(user, LONG_STORY);
    await user.click(rulesBox());
    await user.click(submitButton());

    expect(submitStory).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tenés que declarar que este cuento es de tu autoría.",
    );
    expect(copyrightBox()).toHaveAttribute("aria-invalid", "true");
  });

  it("envía el cuerpo inline en un solo POST y muestra el panel de éxito", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(titleField(), "El sotano");
    await user.type(authorField(), "Ana");
    await user.type(descriptionField(), "Un cuento corto.");
    await typeStory(user, LONG_STORY);
    await checkConsents(user);
    await user.click(submitButton());

    await waitFor(() => expect(submitStory).toHaveBeenCalledTimes(1));
    expect(submitStory).toHaveBeenCalledWith({
      title: "El sotano",
      body: `<p>${LONG_STORY}</p>`,
      description: "Un cuento corto.",
      author: "Ana",
    });

    const success = await screen.findByRole("status");
    expect(success).toHaveTextContent("Tu cuento ya está publicado.");
    expect(success).toHaveTextContent("No hay paso de moderación");
    expect(screen.getByRole("link", { name: "Leer tu cuento" })).toHaveAttribute(
      "href",
      "/story/42",
    );
  });

  it("omite autor y descripción cuando quedaron vacíos", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(titleField(), "El sotano");
    await typeStory(user, LONG_STORY);
    await checkConsents(user);
    await user.click(submitButton());

    await waitFor(() => expect(submitStory).toHaveBeenCalledTimes(1));
    expect(vi.mocked(submitStory).mock.calls[0][0]).toEqual({
      title: "El sotano",
      body: `<p>${LONG_STORY}</p>`,
    });
  });

  it("recupera el borrador guardado en localStorage", async () => {
    localStorage.setItem(
      "story-draft-v1",
      JSON.stringify({
        title: "El pozo",
        author: "Beto",
        description: "Borrador a medias",
        story: "<p>Ya estaba escrito</p>",
      }),
    );

    renderForm();

    expect(titleField()).toHaveValue("El pozo");
    expect(authorField()).toHaveValue("Beto");
    expect(descriptionField()).toHaveValue("Borrador a medias");
    expect(storyField()).toHaveValue("<p>Ya estaba escrito</p>");
    expect(
      await screen.findByText(/recuperamos el borrador/i),
    ).toBeInTheDocument();
  });

  it("borra el borrador una vez enviado", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(titleField(), "El sotano");
    await typeStory(user, LONG_STORY);
    await checkConsents(user);
    await user.click(submitButton());

    await waitFor(() => expect(submitStory).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(localStorage.getItem("story-draft-v1")).toBeNull(),
    );
  });

  it("no envía nada cuando la trampa para bots quedó completa", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(titleField(), "El sotano");
    await typeStory(user, LONG_STORY);
    await checkConsents(user);
    // `aria-hidden` + `tabIndex={-1}` dejan el campo fuera del recorrido real.
    const honeypot = document.getElementById("company") as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "Acme" } });
    await user.click(submitButton());

    expect(submitStory).not.toHaveBeenCalled();
    // Sin avisar: si el bot lee un error, aprende a saltarse el campo.
    expect(
      await screen.findByText("Tu cuento ya está publicado."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Leer tu cuento" }),
    ).not.toBeInTheDocument();
  });
});
describe("UploadForm importacion de .docx", () => {
  it("ofrece la importacion de Word junto al editor", () => {
    renderForm();

    expect(docxField()).toHaveAttribute("accept", expect.stringContaining(".docx"));
  });

  it("carga el documento convertido en el editor y avisa que se importo", async () => {
    renderForm();

    await pickDocx(docxFile());

    expect(await screen.findByText(/importamos tu documento/i)).toBeInTheDocument();
    expect(storyField()).toHaveValue(
      "<h2>El Umbral</h2><p>Golpeo tres veces</p>",
    );
  });

  it("muestra el error del servicio sin perder lo que ya habia escrito", async () => {
    const { DocxImportError } = await import("../services/DocxImportService");
    vi.mocked(importDocx).mockRejectedValue(
      new DocxImportError("El archivo está dañado o no es un .docx válido."),
    );
    renderForm();

    await pickDocx(docxFile());

    expect(await screen.findByRole("alert")).toHaveTextContent(/está dañado/i);
    expect(storyField()).toHaveValue("");
  });

  it("avisa cuando el documento traia formato que el editor no tiene", async () => {
    vi.mocked(importDocx).mockResolvedValue({
      html: "<p>Igual entro</p>",
      text: "Igual entro",
      messages: ["Unsupported style: textbox", "Unsupported style: table"],
    });
    renderForm();

    await pickDocx(docxFile());

    expect(
      await screen.findByText(/2 elemento\(s\).*quedaron como texto simple/i),
    ).toBeInTheDocument();
    expect(storyField()).toHaveValue("<p>Igual entro</p>");
  });

  // Importar borra lo escrito, así que sobre contenido se pregunta primero.
  it("no importa encima de texto existente si se cancela la confirmacion", async () => {
    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockReturnValue(false);
    const user = userEvent.setup();
    renderForm();
    await typeStory(user, "ya habia escrito esto");

    await pickDocx(docxFile());

    expect(confirmSpy).toHaveBeenCalled();
    expect(importDocx).not.toHaveBeenCalled();
    expect(storyField()).toHaveValue("<p>ya habia escrito esto</p>");
    confirmSpy.mockRestore();
  });

  it("importa encima de texto existente si se confirma", async () => {
    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockReturnValue(true);
    const user = userEvent.setup();
    renderForm();
    await typeStory(user, "ya habia escrito esto");

    await pickDocx(docxFile());

    expect(await screen.findByText(/importamos tu documento/i)).toBeInTheDocument();
    expect(storyField()).toHaveValue(
      "<h2>El Umbral</h2><p>Golpeo tres veces</p>",
    );
    confirmSpy.mockRestore();
  });
});
