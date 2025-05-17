import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import TaskList from "@/components/TaskList";

test("renders empty task columns", () => {
  const emptyTaskList = { id: "test-id", name: "Prázdný seznam" };

  render(<TaskList isVisible={true} taskList={emptyTaskList} />);

  expect(screen.getByText(/Otevřené/i)).toBeInTheDocument();
  expect(screen.getByText(/Probíhající/i)).toBeInTheDocument();
  expect(screen.getByText(/Dokončené/i)).toBeInTheDocument();
});
