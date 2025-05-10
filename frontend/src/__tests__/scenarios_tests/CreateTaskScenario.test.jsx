import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import CreateTaskModal from '../src/components/CreateTaskModal';

test('user creates new task successfully', async () => {
  const onCreate = vi.fn();
  render(<CreateTaskModal onCreate={onCreate} />);

  const input = screen.getByPlaceholderText(/task title/i);
  const button = screen.getByRole('button', { name: /create/i });

  await userEvent.type(input, 'Finish test suite');
  await userEvent.click(button);

  expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Finish test suite' }));
});
