import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import TaskDetailModal from '../src/components/TaskDetailModal';

test('calls onClose when close button is clicked', () => {
  const onClose = vi.fn();
  render(<TaskDetailModal task={{ title: 'Test Task' }} onClose={onClose} />);
  
  const closeButton = screen.getByRole('button', { name: /close/i });
  fireEvent.click(closeButton);

  expect(onClose).toHaveBeenCalledTimes(1);
});
