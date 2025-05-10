import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Login from '../src/components/Login';

test('displays error message on login failure', () => {
  const error = 'Invalid email or password';
  render(<Login error={error} onSwitchToRegister={() => {}} />);

  expect(screen.getByText(/invalid email/i)).toBeDefined();
});
