import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Dashboard from "@/components/Dashboard";

test("shows loading indicator", () => {
  render(<Dashboard />);

  // Hledáme český text indikující načítání
  expect(screen.getByText(/načítání/i)).toBeInTheDocument();
});
