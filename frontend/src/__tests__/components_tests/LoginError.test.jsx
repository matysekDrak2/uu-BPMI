import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '@/components/Login';

test('calls onSwitchToRegister when link is clicked', () => {
  const onSwitchToRegister = vi.fn();

  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <Login onSwitchToRegister={onSwitchToRegister} />
    </GoogleOAuthProvider>
  );

  const switchLink = screen.getByText(/zaregistrovat se/i);
  fireEvent.click(switchLink);

  expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
});
