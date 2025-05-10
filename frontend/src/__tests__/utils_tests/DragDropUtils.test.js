import { test, expect } from 'vitest';
import { reorder } from '../src/utils/DragDropUtils';

test('reorders items correctly', () => {
  const list = [1, 2, 3];
  const result = reorder(list, 0, 2);
  expect(result).toEqual([2, 3, 1]);
});
