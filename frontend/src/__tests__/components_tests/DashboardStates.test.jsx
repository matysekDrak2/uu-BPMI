import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Dashboard from '../src/components/Dashboard';

test('shows loading indicator', () => {
  render(<Dashboard isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeDefined();
});
