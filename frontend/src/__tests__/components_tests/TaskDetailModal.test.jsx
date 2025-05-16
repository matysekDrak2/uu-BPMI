import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import TaskDetailModal from "@/components/TaskDetailModal";

// Mocks
vi.mock("@/services/api", () => ({
  taskService: {
    updateTask: vi.fn().mockResolvedValue({}),
  },
  userService: {
    getUserById: vi.fn().mockResolvedValue({ name: "Testovací uživatel" }),
  },
  commentService: {
    createComment: vi.fn(),
    getCommentsByTask: vi.fn().mockResolvedValue([]),
  },
  attachmentService: {
    uploadFileToComment: vi.fn(),
    downloadFile: vi.fn(),
  },
}));

test("zobrazí modal s názvem úkolu", () => {
  const task = {
    id: "abc123",
    text: "Název: Test Task\nPopis: Ukázkový popis\nPriorita: normal\nTermín: 2025-05-30",
    creator: "user1"
  };

  render(
    <TaskDetailModal
      isOpen={true}
      task={task}
      onClose={() => {}}
    />
  );

  expect(screen.getByText(/test task/i)).toBeInTheDocument();
  expect(screen.getByText(/ukázkový popis/i)).toBeInTheDocument();
});
