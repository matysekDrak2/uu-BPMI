import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import Login from '../src/components/Login';

test('user logs in with email and password', async () => {
  const mockLogin = vi.fn();
  render(<Login onLogin={mockLogin} onSwitchToRegister={() => {}} />);

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), '123456');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(mockLogin).toHaveBeenCalledWith('test@example.com', '123456');
});
