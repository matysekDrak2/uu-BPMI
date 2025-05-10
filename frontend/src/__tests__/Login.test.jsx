import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import Login from '../components/Login';

test('shows login form', () => {
  render(<Login onSwitchToRegister={() => {}} />);
  expect(screen.getByLabelText(/email/i)).toBeDefined();
  expect(screen.getByLabelText(/password/i)).toBeDefined();
});
