import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import CreateTaskModal from '../src/components/CreateTaskModal';

test('calls onSubmit when form is submitted', () => {
  const onSubmit = vi.fn();
  render(<CreateTaskModal onSubmit={onSubmit} />);
  
  const submitButton = screen.getByRole('button', { name: /create/i });
  fireEvent.click(submitButton);

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
