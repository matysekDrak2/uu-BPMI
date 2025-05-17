import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import TaskColumn from '@/components/TaskColumn';

test('renders task column title', () => {
  render(
    <TaskColumn
      title="To Do"
      tasks={[]}
      columnState="todo"
      onDragOver={vi.fn()}
      onDragEnter={vi.fn()}
      onDragLeave={vi.fn()}
      onDrop={vi.fn()}
      renderTaskCard={() => null}
    />
  );

  expect(screen.getByText(/to do/i)).toBeInTheDocument();
});
