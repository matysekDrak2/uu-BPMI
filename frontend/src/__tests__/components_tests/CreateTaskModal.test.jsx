import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import CreateTaskModal from "@/components/CreateTaskModal";

test("renders create task modal", () => {
  render(
    <CreateTaskModal
      isOpen={true}
      onClose={() => {}}
      onSubmit={() => {}}
      taskListId="1"
    />
  );

  expect(screen.getByText("Vytvořit nový úkol")).toBeInTheDocument();
});
