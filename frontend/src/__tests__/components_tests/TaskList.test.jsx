import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import TaskList from "@/components/TaskList";

test("renders task list title", () => {
  const mockTaskList = {
    id: "abc123",
    name: "Můj seznam úkolů",
  };

  render(<TaskList isVisible={true} taskList={mockTaskList} />);

  // Hledáme podle českého názvu seznamu
  expect(screen.getByText(/můj seznam úkolů/i)).toBeInTheDocument();
});
