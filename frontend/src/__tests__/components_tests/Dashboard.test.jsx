import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Dashboard from "@/components/Dashboard";

test("renders dashboard component", () => {
  render(<Dashboard />);
  expect(screen.getByText(/\+ nový seznam úkolů/i)).toBeInTheDocument();
});
