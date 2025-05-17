import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Register from '@/components/Register';

test('shows register form', () => {
  render(<Register onSwitchToLogin={() => {}} />);

  // Případná alternativa:
  expect(screen.getByPlaceholderText(/zadejte email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/zadejte heslo/i)).toBeInTheDocument();
});

