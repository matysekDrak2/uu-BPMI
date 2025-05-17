import { test, expect } from 'vitest';
import { validateEmail } from '@/utils/validators';

test('validates correct email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

test('rejects incorrect email', () => {
  expect(validateEmail('invalid-email')).toBe(false);
});
