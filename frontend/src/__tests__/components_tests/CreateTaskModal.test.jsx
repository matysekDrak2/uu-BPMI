import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import CreateTaskModal from '../src/components/CreateTaskModal';

test('renders create task modal', () => {
  render(<CreateTaskModal onClose={() => {}} />);
  expect(screen.getByText(/create task/i)).toBeDefined();
});
