import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import StoryReader from "./StoryReader";

// `POST /api/stories` es público: cualquiera puede mandar HTML arbitrario con
// curl, así que cada regla del allowlist queda fijada por un test.
describe("StoryReader sanitizacion", () => {
  const renderReader = (body: string) =>
    render(<StoryReader body={body} />);

  it("elimina scripts y conserva el texto que los rodea", () => {
    const { container } = renderReader(
      "<p>Antes</p><script>alert(1)</script><p>Despues</p>",
    );

    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("Antes")).toBeInTheDocument();
    expect(screen.getByText("Despues")).toBeInTheDocument();
  });

  it("elimina handlers inline como onerror y onclick", () => {
    const { container } = renderReader(
      '<p onclick="alert(1)">Texto</p><img src="x" onerror="alert(1)">',
    );

    // `img` no está en la allowlist, así que desaparece el elemento entero.
    expect(container.querySelector("img")).toBeNull();    expect(container.querySelector("p")?.hasAttribute("onclick")).toBe(false);
  });

  it("descarta hrefs con esquema peligroso y conserva losseguros", () => {
    const { container } = renderReader(
      '<p><a href="javascript:alert(1)">malo</a></p><p><a href="https://ejemplo.com">bueno</a></p>',
    );
    const links = container.querySelectorAll("a");

    expect(links[0].hasAttribute("href")).toBe(false);
    expect(links[1].getAttribute("href")).toBe("https://ejemplo.com");
  });

  it("fuerza target y rel en cada enlace, sobreescribiendo lo inyectado", () => {
    const { container } = renderReader(
      '<a href="https://ejemplo.com" target="_self" rel="opener">sitio</a>',
    );
    const link = container.querySelector("a");

    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("deja pasar el formato de escritura que produce el editor", () => {
    const { container } = renderReader(
      "<p>Uno <strong>fuerte</strong> y <s>tachado</s> y <em>suave</em></p><h2>Titulo</h2><ul><li>Item</li></ul>",
    );

    expect(container.querySelector("strong")).toHaveTextContent("fuerte");
    expect(container.querySelector("s")).toHaveTextContent("tachado");
    expect(container.querySelector("em")).toHaveTextContent("suave");
    expect(container.querySelector("h2")).toHaveTextContent("Titulo");
    expect(container.querySelector("li")).toHaveTextContent("Item");
  });

  it("descarta etiquetas fuera de la allowlist como h1, iframe y style", () => {
    const { container } = renderReader(
      "<h1>Uno</h1><iframe src='https://ejemplo.com'></iframe><style>body{display:none}</style><p>Dos</p>",
    );

    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("style")).toBeNull();
    expect(screen.getByText("Dos")).toBeInTheDocument();
  });

  // La prosa clásica va al `<pre>`, donde React escapa el texto: ahí no hay
  // HTML que interpretar ni que sanitizar.
  it("renderiza prosa clasica como texto, sin interpretarla", () => {
    const body = "Habia una vez.\n\n  Dos  espacios.";
    const { container } = renderReader(body);
    const pre = container.querySelector("pre");

    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toBe(body);
    expect(container.querySelector("div.story-body")).toBeNull();
  });

  it("muestra un cuerpo sin etiquetas de bloque tal cual, sin ejecutarlo", () => {
    const { container } = renderReader("<script>alert(1)</script>");

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe(
      "<script>alert(1)</script>",
    );
  });
});

describe("StoryReader controles", () => {
  it("cambia el tamaño de letra y lo persiste", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(<StoryReader body="<p>Historia</p>" />);

    await user.click(
      screen.getByRole("button", { name: "Aumentar tamaño de letra" }),
    );

    expect(screen.getByText("110%")).toBeInTheDocument();
    expect(localStorage.getItem("reader-font-size")).toBe("110");
  });

  it("alterna el modo nocturno con aria-pressed", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(<StoryReader body="<p>Historia</p>" />);
    const toggle = screen.getByRole("button", { name: "Activar modo nocturno" });

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Desactivar modo nocturno" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
