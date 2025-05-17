import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import CreateTaskModal from "@/components/CreateTaskModal";

test("calls onCreate with task data", () => {
  const handleSubmit = vi.fn();

  render(
    <CreateTaskModal
      isOpen={true}
      onClose={() => {}}
      onSubmit={handleSubmit}
      taskListId={"123"}
    />
  );

  const titleInput = screen.getByPlaceholderText(/zadejte název úkolu/i);
  fireEvent.change(titleInput, { target: { value: "Testovací úkol" } });

  const confirmButton = screen.getByRole("button", { name: /potvrdit/i });
  fireEvent.click(confirmButton);

  expect(handleSubmit).toHaveBeenCalledWith(expect.stringContaining("Testovací úkol"));
});
