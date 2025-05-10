import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TaskComments from '../src/components/TaskComments';

test('renders comments section', () => {
  render(<TaskComments comments={[]} />);
  expect(screen.getByText(/comments/i)).toBeDefined();
});
