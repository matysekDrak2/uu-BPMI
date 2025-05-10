import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskList from '../src/components/TaskList';

test('renders task list title', () => {
  const list = { id: 1, title: 'My Tasks' };
  render(<TaskList list={list} tasks={[]} />);
  expect(screen.getByText(/my tasks/i)).toBeDefined();
});
