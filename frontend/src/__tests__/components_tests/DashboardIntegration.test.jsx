import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Dashboard from "@/components/Dashboard";

test("Dashboard renders TaskList with at least one TaskCard", () => {
  render(<Dashboard />);

  // Ověříme, že se zobrazí hlavička s tlačítky
  expect(
    screen.getByRole("button", { name: /\+ nový seznam úkolů/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /odhlásit se/i })
  ).toBeInTheDocument();

  // Ověříme, že se zobrazuje indikátor načítání
  expect(screen.getByText(/načítání/i)).toBeInTheDocument();
});
