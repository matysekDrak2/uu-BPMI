import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import CreateTaskListModal from "@/components/CreateTaskListModal";

test("renders create task list modal", () => {
  render(<CreateTaskListModal isOpen={true} onClose={() => {}} />);
  expect(screen.getByText(/create task list/i)).toBeInTheDocument();
});
