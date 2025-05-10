import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskList from '../src/components/TaskList';

test('displays empty state when no tasks', () => {
  const list = { id: 1, title: 'Empty List' };
  render(<TaskList list={list} tasks={[]} />);

  expect(screen.getByText(/no tasks/i)).toBeDefined();
});
