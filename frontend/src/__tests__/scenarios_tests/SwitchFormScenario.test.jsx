import { render, screen, fireEvent, within } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '@/components/Login';
import Register from '@/components/Register';

const wrapper = (ui) => (
  <GoogleOAuthProvider clientId="test-client-id">
    {ui}
  </GoogleOAuthProvider>
);

test('user switches from login to register form', () => {
  const onSwitchToRegister = vi.fn();
  render(wrapper(<Login onSwitchToRegister={onSwitchToRegister} />));

  const prompt = screen.getByText(/nemáte účet/i).closest('.switch-prompt');
  const link = within(prompt).getByText(/zaregistrovat se/i);
  fireEvent.click(link);

  expect(onSwitchToRegister).toHaveBeenCalled();
});

test('user switches from register to login form', () => {
  const onSwitchToLogin = vi.fn();
  render(wrapper(<Register onSwitchToLogin={onSwitchToLogin} />));

  const prompt = screen.getByText(/již máte účet/i).closest('.switch-prompt');
  const link = within(prompt).getByText(/přihlásit se/i);
  fireEvent.click(link);

  expect(onSwitchToLogin).toHaveBeenCalled();
});
