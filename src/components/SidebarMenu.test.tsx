import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SidebarMenu from "./SidebarMenu";

vi.mock("../hooks/useTitles", () => ({
  useStoryTitles: () => ({
    titles: [{ id: 1, title: "El Sotano" }],
    isLoading: false,
    isFallback: false,
    refresh: vi.fn(),
  }),
  useClassicTitles: () => ({
    titles: [{ slug: "casa-maldita", title: "La Casa", author: "Poe" }],
    isLoading: false,
    isFallback: false,
    refresh: vi.fn(),
  }),
}));

const renderMenu = () =>
  render(
    <MemoryRouter>
      <SidebarMenu />
    </MemoryRouter>,
  );

const openButton = () => screen.getByRole("button", { name: /abrir menú/i });
const closeButton = () => screen.getByRole("button", { name: /^cerrar menú$/i });
const dialog = () => screen.getByRole("dialog");

describe("SidebarMenu", () => {
  it("no monta el panel hasta la primera apertura", () => {
    renderMenu();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("monta el panel y enfoca el boton de cerrar en la primera apertura", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(openButton());

    expect(dialog()).toBeInTheDocument();
    await waitFor(() => expect(closeButton()).toHaveFocus());
  });

  it("no remonta el panel al reabrirlo", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(openButton());
    const first = dialog();

    await user.click(closeButton());
    await user.click(openButton());

    expect(dialog()).toBe(first);
  });

  it("cierra con Escape y devuelve el foco al boton que la abrio", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(openButton());
    await user.keyboard("{Escape}");

    expect(dialog()).toHaveAttribute("data-state", "closed");
    expect(openButton()).toHaveFocus();
  });

  it("no abre con una tecla sola pero si con Ctrl+M", async () => {
    renderMenu();

    fireEvent.keyDown(window, { key: "m" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "m", ctrlKey: true });
    expect(dialog()).toBeInTheDocument();
  });

  it("navega con el foco usando las flechas dentro del panel", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(openButton());
    await user.keyboard("{ArrowDown}");

    await waitFor(() =>
      expect(screen.getByRole("link", { name: /El Sotano/ })).toHaveFocus(),
    );
  });

  it("expone los destinos como enlaces reales", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(openButton());

    expect(screen.getByRole("link", { name: /El Sotano/ })).toHaveAttribute(
      "href",
      "/story/1",
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  // jsdom no implementa la semántica de `inert`: se verifica el atributo.
  it("deja el toggle inert mientras el panel está abierto", async () => {
    const user = userEvent.setup();
    renderMenu();
    const toggle = () =>
      screen.getByRole("button", { name: /menú de historias/i });

    expect(toggle()).not.toHaveAttribute("inert");

    await user.click(toggle());
    expect(toggle()).toHaveAttribute("inert");

    await user.keyboard("{Escape}");
    expect(toggle()).not.toHaveAttribute("inert");
  });
});
