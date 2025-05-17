import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import CreateTaskModal from "@/components/CreateTaskModal";

test("calls onSubmit when form is submitted", () => {
  const mockedSubmit = vi.fn();
  const mockedClose = vi.fn();

  render(
    <CreateTaskModal
      isOpen={true}
      onClose={mockedClose}
      onSubmit={mockedSubmit}
      taskListId="test-list"
    />
  );

  // Vyplníme název úkolu (je povinný)
  const titleInput = screen.getByPlaceholderText(/zadejte název úkolu/i);
  fireEvent.change(titleInput, { target: { value: "Test Úkol" } });

  // Klikneme na tlačítko "Potvrdit"
  const submitButton = screen.getByRole("button", { name: /potvrdit/i });
  fireEvent.click(submitButton);

  // Ověříme, že onSubmit byl zavolán
  expect(mockedSubmit).toHaveBeenCalled();
});
