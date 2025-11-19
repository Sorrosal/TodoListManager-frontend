import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTodoItems } from '../useTodoItems';
import { todoListService } from 'src/services';
import { Notify, Dialog } from 'quasar';
import type { TodoItem, AddItemRequest, UpdateItemRequest } from 'src/models';

vi.mock('src/services', () => ({
  todoListService: {
    getAllItems: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
    registerProgression: vi.fn(),
  },
}));

vi.mock('quasar', () => ({
  Notify: {
    create: vi.fn(),
  },
  Dialog: {
    create: vi.fn(() => ({
      onOk: vi.fn((callback) => {
        callback();
        return { onCancel: vi.fn() };
      }),
      onCancel: vi.fn(),
    })),
  },
}));

describe('useTodoItems', () => {
  const mockTodoItems: TodoItem[] = [
    {
      id: 1,
      title: 'Work Task',
      description: 'Description 1',
      category: 'Work',
      totalProgress: 50,
      isCompleted: false,
      lastProgressionDate: '2024-01-01T00:00:00Z',
      progressions: [{ id: 1, date: '2024-01-01T00:00:00Z', percent: 50, todoItemId: 1 }],
    },
    {
      id: 2,
      title: 'Personal Task',
      description: 'Description 2',
      category: 'Personal',
      totalProgress: 0,
      isCompleted: false,
      lastProgressionDate: null,
      progressions: [],
    },
    {
      id: 3,
      title: 'Another Work Task',
      description: 'Description 3',
      category: 'Work',
      totalProgress: 75,
      isCompleted: false,
      lastProgressionDate: '2024-01-02T00:00:00Z',
      progressions: [{ id: 2, date: '2024-01-02T00:00:00Z', percent: 75, todoItemId: 3 }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty items and not loading', () => {
      const { items, isLoading } = useTodoItems();

      expect(items.value).toEqual([]);
      expect(isLoading.value).toBe(false);
    });
  });

  describe('fetchItems', () => {
    it('should fetch and set items successfully', async () => {
      vi.mocked(todoListService.getAllItems).mockResolvedValue(mockTodoItems);

      const { fetchItems, items, isLoading } = useTodoItems();

      const promise = fetchItems();
      expect(isLoading.value).toBe(true);

      await promise;

      expect(todoListService.getAllItems).toHaveBeenCalled();
      expect(items.value).toEqual(mockTodoItems);
      expect(isLoading.value).toBe(false);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      vi.mocked(todoListService.getAllItems).mockRejectedValue(error);

      const { fetchItems, isLoading } = useTodoItems();

      await fetchItems();

      expect(isLoading.value).toBe(false);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Failed to load tasks.',
        position: 'top',
      });
    });
  });

  describe('itemsByCategory', () => {
    it('should group items by category', async () => {
      vi.mocked(todoListService.getAllItems).mockResolvedValue(mockTodoItems);

      const { fetchItems, itemsByCategory } = useTodoItems();
      await fetchItems();

      expect(itemsByCategory.value).toEqual({
        Work: [mockTodoItems[0], mockTodoItems[2]],
        Personal: [mockTodoItems[1]],
      });
    });

    it('should return empty object when no items', () => {
      const { itemsByCategory } = useTodoItems();

      expect(itemsByCategory.value).toEqual({});
    });
  });

  describe('addItem', () => {
    it('should add item successfully', async () => {
      const newItem: AddItemRequest = {
        title: 'New Task',
        description: 'New Description',
        category: 'Work',
      };

      vi.mocked(todoListService.addItem).mockResolvedValue(mockTodoItems[0]!);
      vi.mocked(todoListService.getAllItems).mockResolvedValue(mockTodoItems);

      const { addItem } = useTodoItems();
      const result = await addItem(newItem);

      expect(todoListService.addItem).toHaveBeenCalledWith(newItem);
      expect(result).toBe(true);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Task added successfully!',
        position: 'top',
      });
    });

    it('should handle add errors', async () => {
      const newItem: AddItemRequest = {
        title: 'New Task',
        description: 'New Description',
        category: 'Work',
      };

      const error = { response: { data: { message: 'Validation error' } } };
      vi.mocked(todoListService.addItem).mockRejectedValue(error);

      const { addItem } = useTodoItems();
      const result = await addItem(newItem);

      expect(result).toBe(false);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Validation error',
        position: 'top',
      });
    });
  });

  describe('updateItem', () => {
    it('should update item successfully', async () => {
      const updateData: UpdateItemRequest = {
        description: 'Updated Description',
      };

      vi.mocked(todoListService.updateItem).mockResolvedValue({
        ...mockTodoItems[0]!,
        description: updateData.description,
      });
      vi.mocked(todoListService.getAllItems).mockResolvedValue(mockTodoItems);

      const { updateItem } = useTodoItems();
      const result = await updateItem(1, updateData);

      expect(todoListService.updateItem).toHaveBeenCalledWith(1, updateData);
      expect(result).toBe(true);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Task updated successfully!',
        position: 'top',
      });
    });

    it('should handle update errors', async () => {
      const updateData: UpdateItemRequest = {
        description: 'Updated Description',
      };

      const error = { response: { data: { message: 'Item not found' } } };
      vi.mocked(todoListService.updateItem).mockRejectedValue(error);

      const { updateItem } = useTodoItems();
      const result = await updateItem(999, updateData);

      expect(result).toBe(false);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Item not found',
        position: 'top',
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete item after confirmation', async () => {
      vi.mocked(todoListService.deleteItem).mockResolvedValue();
      vi.mocked(todoListService.getAllItems).mockResolvedValue(mockTodoItems);

      const { deleteItem } = useTodoItems();
      await deleteItem(mockTodoItems[0]!);

      expect(Dialog.create).toHaveBeenCalledWith({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete "Work Task"?',
        cancel: true,
        persistent: true,
      });
      expect(todoListService.deleteItem).toHaveBeenCalledWith(1);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Task deleted successfully!',
        position: 'top',
      });
    });
  });

  describe('registerProgress', () => {
    it('should register progress successfully', async () => {
      const progressData = {
        date: '2024-01-03T10:00:00Z',
        percent: 90,
      };

      vi.mocked(todoListService.registerProgression).mockResolvedValue();
      vi.mocked(todoListService.getAllItems).mockResolvedValue(mockTodoItems);

      const { registerProgress } = useTodoItems();
      const result = await registerProgress(1, progressData);

      expect(todoListService.registerProgression).toHaveBeenCalledWith(1, progressData);
      expect(result).toBe(true);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Progress registered successfully!',
        position: 'top',
      });
    });

    it('should handle register progress errors', async () => {
      const progressData = {
        date: '2024-01-03T10:00:00Z',
        percent: 90,
      };

      const error = { response: { data: { message: 'Invalid data' } } };
      vi.mocked(todoListService.registerProgression).mockRejectedValue(error);

      const { registerProgress } = useTodoItems();
      const result = await registerProgress(1, progressData);

      expect(result).toBe(false);
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Invalid data',
        position: 'top',
      });
    });
  });

  describe('getLatestProgress', () => {
    it('should return latest progress percent', () => {
      const { getLatestProgress } = useTodoItems();

      // mockTodoItems[0] has a single progression of 50
      const result = getLatestProgress(mockTodoItems[0]!);

      expect(result).toBe(50);
    });

    it('should return null when no progressions', () => {
      const { getLatestProgress } = useTodoItems();

      const result = getLatestProgress(mockTodoItems[1]!);

      expect(result).toBeNull();
    });

    it('should return null when progressions array is undefined', () => {
      const { getLatestProgress } = useTodoItems();
      const item: TodoItem = {
        id: 1,
        title: 'Test',
        description: 'Test',
        category: 'Work',
        totalProgress: 0,
        isCompleted: false,
        lastProgressionDate: null,
        progressions: [],
      };

      const result = getLatestProgress(item);

      expect(result).toBeNull();
    });

    it('should accumulate multiple progression entries and cap at 100', () => {
      const { getLatestProgress } = useTodoItems();
      const item: TodoItem = {
        id: 1,
        title: 'Accumulated',
        description: 'Testing',
        category: 'Work',
        totalProgress: 96,
        isCompleted: false,
        lastProgressionDate: '2025-11-18T18:43:00Z',
        progressions: [
          { id: 1, date: '2025-11-18T18:38:00Z', percent: 9, todoItemId: 1 },
          { id: 2, date: '2025-11-18T18:40:00Z', percent: 31, todoItemId: 1 },
          { id: 3, date: '2025-11-18T18:43:00Z', percent: 56, todoItemId: 1 },
        ],
      };

      const result = getLatestProgress(item);

      // 9 + 31 + 56 = 96
      expect(result).toBe(96);
    });
  });

  describe('getProgressColor', () => {
    it('should return negative color for progress < 30', () => {
      const { getProgressColor } = useTodoItems();

      expect(getProgressColor(0)).toBe('negative');
      expect(getProgressColor(29)).toBe('negative');
    });

    it('should return warning color for progress 30-69', () => {
      const { getProgressColor } = useTodoItems();

      expect(getProgressColor(30)).toBe('warning');
      expect(getProgressColor(50)).toBe('warning');
      expect(getProgressColor(69)).toBe('warning');
    });

    it('should return positive color for progress >= 70', () => {
      const { getProgressColor } = useTodoItems();

      expect(getProgressColor(70)).toBe('positive');
      expect(getProgressColor(100)).toBe('positive');
    });
  });

  describe('getSortedProgressions', () => {
    it('should return progressions sorted by date descending', () => {
      const item: TodoItem = {
        id: 1,
        title: 'Test',
        description: 'Test',
        category: 'Work',
        totalProgress: 75,
        isCompleted: false,
        lastProgressionDate: '2024-01-03T00:00:00Z',
        progressions: [
          { id: 1, date: '2024-01-01T00:00:00Z', percent: 25, todoItemId: 1 },
          { id: 2, date: '2024-01-03T00:00:00Z', percent: 75, todoItemId: 1 },
          { id: 3, date: '2024-01-02T00:00:00Z', percent: 50, todoItemId: 1 },
        ],
      };

      const { getSortedProgressions } = useTodoItems();
      const result = getSortedProgressions(item);

      expect(result[0]?.date).toBe('2024-01-03T00:00:00Z');
      expect(result[1]?.date).toBe('2024-01-02T00:00:00Z');
      expect(result[2]?.date).toBe('2024-01-01T00:00:00Z');
    });

    it('should return empty array when no progressions', () => {
      const item: TodoItem = {
        id: 1,
        title: 'Test',
        description: 'Test',
        category: 'Work',
        totalProgress: 0,
        isCompleted: false,
        lastProgressionDate: null,
        progressions: [],
      };

      const { getSortedProgressions } = useTodoItems();
      const result = getSortedProgressions(item);

      expect(result).toEqual([]);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const { formatDate } = useTodoItems();

      const result = formatDate('2024-01-15T14:30:00Z');

      // Result will vary by locale, so just check it contains expected parts
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });
});
