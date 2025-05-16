import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import CreateTaskListModal from "@/components/CreateTaskListModal";

test("renders create task list modal", () => {
  render(
    <CreateTaskListModal
      isOpen={true}
      onClose={() => {}}
      onSubmit={() => {}}
      taskListName=""
      setTaskListName={() => {}}
      error={null}
    />
  );

  expect(screen.getByText("Vytvořit nový seznam úkolů")).toBeInTheDocument();
});
