import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskList from '../src/components/TaskList';

test('renders message when task list is empty', () => {
  render(<TaskList list={{ id: 1, title: 'Empty' }} tasks={[]} />);
  expect(screen.getByText(/no tasks available/i)).toBeDefined();
});
