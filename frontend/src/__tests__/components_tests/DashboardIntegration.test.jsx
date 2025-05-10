import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Dashboard from '../src/components/Dashboard';

// předpokládá, že Dashboard si načítá tasky nebo předává dál props
test('Dashboard renders TaskList with at least one TaskCard', () => {
  render(<Dashboard />);

  expect(screen.getByText(/my tasks/i)).toBeDefined(); // TaskList title
  expect(screen.getByText(/test task/i)).toBeDefined(); // TaskCard title
});
