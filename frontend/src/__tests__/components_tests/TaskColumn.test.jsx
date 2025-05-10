import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskColumn from '../src/components/TaskColumn';

test('renders task column title', () => {
  const column = { id: 1, title: 'To Do' };
  render(<TaskColumn column={column} tasks={[]} />);
  expect(screen.getByText(/to do/i)).toBeDefined();
});
