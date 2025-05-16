import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import TaskDetailModal from "@/components/TaskDetailModal";

test("calls onClose when close button is clicked", () => {
  const onClose = vi.fn();

  const mockTask = {
    id: "123",
    text: "Název: Test Task\nPopis: Popis úkolu\nPriorita: normal",
    creator: "user1",
  };

  render(<TaskDetailModal isOpen={true} task={mockTask} onClose={onClose} />);

  // Ověříme že tlačítko Zavřít existuje
  const closeButton = screen.getByRole("button", { name: /zavřít/i });

  // Simulujeme kliknutí
  fireEvent.click(closeButton);

  // Očekáváme zavolání funkce
  expect(onClose).toHaveBeenCalled();
});
