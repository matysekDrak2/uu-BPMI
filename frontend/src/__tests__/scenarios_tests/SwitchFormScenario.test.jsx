import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import Login from '../src/components/Login';

test('user switches to register form', () => {
  const switchFn = vi.fn();
  render(<Login onSwitchToRegister={switchFn} />);

  const switchButton = screen.getByRole('button', { name: /register/i });
  fireEvent.click(switchButton);

  expect(switchFn).toHaveBeenCalled();
});
