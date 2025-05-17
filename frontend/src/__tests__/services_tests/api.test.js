import { vi, test, expect } from 'vitest';
import { authService, taskService } from '@/services/api';

test('authService.login is a function', () => {
  expect(typeof authService.login).toBe('function');
});
