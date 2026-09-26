import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AmbientSoundSelector from "./AmbientSoundSelector";

const toggle = () => screen.getByRole("button", { name: /elegir sonido/i });
const panel = () => screen.getByRole("group", { name: /sonidos de ambiente/i });
const firstOption = () => screen.getByRole("button", { name: /fogata/i });

describe("AmbientSoundSelector", () => {
  it("arranca cerrado y no declara popup", () => {
    render(<AmbientSoundSelector />);

    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).not.toHaveAttribute("aria-haspopup");
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("al abrir mueve el foco a la primera opción", async () => {
    const user = userEvent.setup();
    render(<AmbientSoundSelector />);

    await user.click(toggle());

    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(toggle()).toHaveAttribute("aria-controls", panel().id);
    expect(firstOption()).toHaveFocus();
  });

  it("Escape cierra y devuelve el foco al toggle", async () => {
    const user = userEvent.setup();
    render(<AmbientSoundSelector />);

    await user.click(toggle());
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveFocus();
  });

  it("al elegir un sonido cierra y lo deja marcado", async () => {
    const user = userEvent.setup();
    render(<AmbientSoundSelector />);

    await user.click(toggle());
    await user.click(screen.getByRole("button", { name: /bosque nocturno/i }));

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(toggle()).toHaveFocus();

    await user.click(toggle());
    expect(screen.getByRole("button", { name: /bosque nocturno/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
