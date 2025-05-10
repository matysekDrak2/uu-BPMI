import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Register from '../src/components/Register';

test('shows register form', () => {
  render(<Register onSwitchToLogin={() => {}} />);
  expect(screen.getByLabelText(/email/i)).toBeDefined();
  expect(screen.getByLabelText(/password/i)).toBeDefined();
});
