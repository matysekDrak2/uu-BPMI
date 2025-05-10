import { vi, test, expect } from 'vitest';
import * as api from '../src/services/api';

vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(() => Promise.resolve({ token: 'fake-token' })),
  },
}));

test('login calls API', async () => {
  await api.authService.login('email', 'password');
  expect(api.authService.login).toHaveBeenCalledWith('email', 'password');
});
