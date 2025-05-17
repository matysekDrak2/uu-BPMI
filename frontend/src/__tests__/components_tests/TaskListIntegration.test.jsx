import { render, screen, waitFor } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import TaskList from "@/components/TaskList";
import * as api from "@/services/api";

// Mockuj službu pro načtení úkolů
vi.mock("@/services/api", async () => {
  const actual = await vi.importActual("@/services/api");
  return {
    ...actual,
    taskService: {
      ...actual.taskService,
      getTasksByListId: vi.fn(),
    },
  };
});

test("TaskList renders multiple TaskCards", async () => {
  api.taskService.getTasksByListId.mockResolvedValue({
    open: [
      { id: "1", text: "Název: Task A\nPopis: Popis A\nPriorita: normal", state: 0 },
      { id: "2", text: "Název: Task B\nPopis: Popis B\nPriorita: high", state: 0 },
    ],
    inProgress: [],
    completed: [],
  });

  render(
    <TaskList
      isVisible={true}
      taskList={{ id: "test-list-id", name: "My Tasks" }}
    />
  );

  await waitFor(() => {
    expect(screen.getByText(/task a/i)).toBeInTheDocument();
    expect(screen.getByText(/task b/i)).toBeInTheDocument();
  });
});
