import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '@/components/Login';

test('shows login form', () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <Login onSwitchToRegister={() => {}} />
    </GoogleOAuthProvider>
  );

  expect(screen.getByRole('heading', { name: /přihlášení/i })).toBeInTheDocument();
});
