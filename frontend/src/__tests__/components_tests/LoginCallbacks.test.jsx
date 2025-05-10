import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import Login from '../src/components/Login';

test('calls onSwitchToRegister when link is clicked', () => {
  const onSwitchToRegister = vi.fn();
  render(<Login onSwitchToRegister={onSwitchToRegister} />);
  
  const switchLink = screen.getByRole('button', { name: /register/i });
  fireEvent.click(switchLink);

  expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
});
