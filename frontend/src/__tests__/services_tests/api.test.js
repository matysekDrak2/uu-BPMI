import { vi, test, expect } from 'vitest';
import * as api from '../src/services/api';

test('authService.login is a function', () => {
  expect(typeof api.authService.login).toBe('function');
});
