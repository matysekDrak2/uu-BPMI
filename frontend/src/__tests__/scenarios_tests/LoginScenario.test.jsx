import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '@/components/Login';
import { authService } from '@/services/api';

// Mockuj přihlášení
vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({}),
    googleAuth: vi.fn()
  }
}));

// mock window.switchToDashboard
vi.stubGlobal('window', Object.create(window));
window.switchToDashboard = vi.fn();

test('user logs in with email and password', async () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <Login onSwitchToRegister={() => {}} />
    </GoogleOAuthProvider>
  );

  // Zadej email a heslo
  fireEvent.change(screen.getByPlaceholderText(/zadejte email/i), {
    target: { value: 'test@example.com' }
  });

  fireEvent.change(screen.getByPlaceholderText(/zadejte heslo/i), {
    target: { value: 'password123' }
  });

  // Klikni na tlačítko
  fireEvent.click(screen.getByRole('button', { name: /přihlásit se/i }));

  // Počkej na přesměrování
  await waitFor(() => {
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(window.switchToDashboard).toHaveBeenCalled();
  });
});
