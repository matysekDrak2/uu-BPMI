import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '@/components/Login';

test('allows typing into email and password fields', () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <Login onSwitchToRegister={() => {}} />
    </GoogleOAuthProvider>
  );

  const emailInput = screen.getByPlaceholderText(/zadejte email/i);
  const passwordInput = screen.getByPlaceholderText(/zadejte heslo/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'secret123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('secret123');
});
