import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskList from '../src/components/TaskList';

test('TaskList renders multiple TaskCards', () => {
  const mockList = { id: 1, title: 'Sprint 1' };
  const mockTasks = [
    { id: 1, title: 'Task A' },
    { id: 2, title: 'Task B' },
  ];

  render(<TaskList list={mockList} tasks={mockTasks} />);
  
  expect(screen.getByText(/task a/i)).toBeDefined();
  expect(screen.getByText(/task b/i)).toBeDefined();
});
