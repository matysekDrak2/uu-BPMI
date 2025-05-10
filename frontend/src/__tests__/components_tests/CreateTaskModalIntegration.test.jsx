import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import CreateTaskModal from '../src/components/CreateTaskModal';

test('calls onCreate with task data', () => {
  const onCreate = vi.fn();
  render(<CreateTaskModal onCreate={onCreate} />);
  
  fireEvent.change(screen.getByPlaceholderText(/task title/i), {
    target: { value: 'New Task' },
  });
  fireEvent.click(screen.getByRole('button', { name: /create/i }));

  expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Task' }));
});
