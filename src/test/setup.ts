import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// `globals` no está activo en vitest, así que el auto-cleanup de RTL no se
// registra solo y el DOM se acumula entre tests.
afterEach(cleanup);
