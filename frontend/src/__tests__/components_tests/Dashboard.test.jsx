import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Dashboard from '../src/components/Dashboard';

test('renders dashboard heading', () => {
  render(<Dashboard />);
  expect(screen.getByText(/dashboard/i)).toBeDefined();
});
