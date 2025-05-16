import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { TaskCard } from '@/components/TaskCard';

test('renders task title', () => {
  const task = {
    id: 1,
    state: 0,
    text: 'Název: Test Task\nPopis: Details\nPriorita: normal'
  };

  render(
    <TaskCard
      task={task}
      onViewTask={() => {}}
      onDragStart={() => {}}
      onDragEnd={() => {}}
      onDragOver={() => {}}
      onDragLeave={() => {}}
    />
  );

  expect(screen.getByText(/test task/i)).toBeInTheDocument();
});
