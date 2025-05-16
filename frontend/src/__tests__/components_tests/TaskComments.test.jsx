import { render, screen, waitFor } from "@testing-library/react";
import { test, expect, vi, beforeEach } from "vitest";
import TaskComments from "@/components/TaskComments";

// Mock API služby
vi.mock("@/services/api", () => ({
  commentService: {
    getCommentsByTask: vi.fn().mockResolvedValue([]),
    createComment: vi.fn().mockResolvedValue({}),
  },
  userService: {
    getUserById: vi.fn().mockResolvedValue({ name: "Testovací uživatel" }),
  },
  attachmentService: {
    downloadFile: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("zobrazí nadpis 'Komentáře'", async () => {
  render(<TaskComments taskId="123" />);
  
  // Počkej, než se načtou komentáře
  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /komentáře/i })).toBeInTheDocument();
  });
});

test("zobrazí hlášku o žádných komentářích", async () => {
  render(<TaskComments taskId="123" />);

  await waitFor(() => {
    expect(screen.getByText(/zatím žádné komentáře/i)).toBeInTheDocument();
  });
});
