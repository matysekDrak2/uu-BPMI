import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskDetailModal from '../src/components/TaskDetailModal';

test('renders task detail modal', () => {
  const task = { id: 1, title: 'Test Task' };
  render(<TaskDetailModal task={task} onClose={() => {}} />);
  expect(screen.getByText(/test task/i)).toBeDefined();
});
