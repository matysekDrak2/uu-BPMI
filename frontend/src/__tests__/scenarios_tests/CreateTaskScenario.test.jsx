import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import TaskList from '@/components/TaskList';

// Mockuj taskService
vi.mock('@/services/api', () => ({
  taskService: {
    createTask: vi.fn(() =>
      Promise.resolve({
        id: 123,
        text: 'Název: Můj nový úkol\nPriorita: normal\nPopis: Testovací popis',
        state: 0
      })
    ),
    getTasksByListId: vi.fn(() =>
      Promise.resolve({
        open: [{
          id: 123,
          text: 'Název: Můj nový úkol\nPriorita: normal\nPopis: Testovací popis',
          state: 0
        }],
        inProgress: [],
        completed: []
      })
    )
  }
}));

test('user creates new task successfully', async () => {
  const taskList = { id: 1, name: 'Test List' };

  render(<TaskList isVisible={true} taskList={taskList} />);

  // Klik na "Vytvořit úkol"
  const createButton = screen.getByRole('button', { name: /vytvořit úkol/i });
  fireEvent.click(createButton);

  // Vyplnění pole názvu
  const titleInput = await screen.findByPlaceholderText(/zadejte název úkolu/i);
  fireEvent.change(titleInput, { target: { value: 'Můj nový úkol' } });

  // Potvrzení formuláře
  const confirmButton = screen.getByRole('button', { name: /potvrdit/i });
  fireEvent.click(confirmButton);

  // Ověření, že úkol byl zobrazen ve sloupci "Otevřené"
  const taskTitle = await screen.findByRole('heading', { name: /můj nový úkol/i });
  expect(taskTitle).toBeInTheDocument();
});
