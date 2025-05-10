import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import Login from '../src/components/Login';

test('allows typing into email and password fields', async () => {
  render(<Login onSwitchToRegister={() => {}} />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password123');

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
});
