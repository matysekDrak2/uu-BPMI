import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskCard from '../src/components/TaskCard';

test('renders task title', () => {
  const task = { id: 1, title: 'Test Task', description: 'Details' };
  render(<TaskCard task={task} />);
  expect(screen.getByText(/test task/i)).toBeDefined();
});
