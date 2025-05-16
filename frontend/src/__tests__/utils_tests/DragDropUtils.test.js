import { test, expect } from 'vitest';
import { handleReorderTask } from '@/utils/DragDropUtils';

test('reorders task in same column', () => {
  const tasks = {
    open: [{ id: 1 }, { id: 2 }, { id: 3 }],
    inProgress: [],
    completed: []
  };

  const result = handleReorderTask(tasks, 1, 0, 3, 'before');

  expect(result.open.map(t => t.id)).toEqual([2, 1, 3]);
});
