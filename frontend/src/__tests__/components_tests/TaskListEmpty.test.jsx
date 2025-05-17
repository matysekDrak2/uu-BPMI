import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskList from '@/components/TaskList';

test('displays empty state when no tasks', () => {
  const taskList = { id: 1, name: 'Test List', tasks: { open: [], inProgress: [], completed: [] } };

  render(<TaskList isVisible={true} taskList={taskList} />);
  
  // Příklad očekávání nějakého prázdného stavu
  expect(screen.getByText(/otevřené/i)).toBeDefined(); // Nebo použij .toBeInTheDocument() pokud používáš jest-dom
});
