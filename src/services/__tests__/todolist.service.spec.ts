import { describe, it, expect, vi, beforeEach } from 'vitest';
import { todoListService } from '../todolist.service';
import { apiClient } from '../api.client';
import type {
  TodoItem,
  AddItemRequest,
  UpdateItemRequest,
  RegisterProgressionRequest,
} from 'src/models';

vi.mock('../api.client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TodoListService', () => {
  const mockTodoItem: TodoItem = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    category: 'Work',
    totalProgress: 50,
    isCompleted: false,
    lastProgressionDate: '2024-01-01T00:00:00Z',
    progressions: [
      {
        id: 1,
        date: '2024-01-01T00:00:00Z',
        percent: 50,
        todoItemId: 1,
      },
    ],
  };

  const mockTodoItems: TodoItem[] = [
    mockTodoItem,
    {
      id: 2,
      title: 'Another Task',
      description: 'Another Description',
      category: 'Personal',
      totalProgress: 0,
      isCompleted: false,
      lastProgressionDate: null,
      progressions: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllItems', () => {
    it('should fetch all todo items', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { items: mockTodoItems, totalCount: mockTodoItems.length },
      });

      const result = await todoListService.getAllItems();

      expect(apiClient.get).toHaveBeenCalledWith('/api/TodoList/items');
      expect(result).toEqual(mockTodoItems);
    });

    it('should throw error when fetching fails', async () => {
      const error = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(todoListService.getAllItems()).rejects.toThrow('Network error');
    });
  });

  describe('addItem', () => {
    it('should add a new todo item', async () => {
      const newItem: AddItemRequest = {
        title: 'New Task',
        description: 'New Description',
        category: 'Work',
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockTodoItem });

      const result = await todoListService.addItem(newItem);

      expect(apiClient.post).toHaveBeenCalledWith('/api/TodoList/items', newItem);
      expect(result).toEqual(mockTodoItem);
    });

    it('should throw error when adding item fails', async () => {
      const newItem: AddItemRequest = {
        title: 'New Task',
        description: 'New Description',
        category: 'Work',
      };
      const error = new Error('Validation error');
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(todoListService.addItem(newItem)).rejects.toThrow('Validation error');
    });
  });

  describe('updateItem', () => {
    it('should update an existing todo item', async () => {
      const updateData: UpdateItemRequest = {
        description: 'Updated Description',
      };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: { ...mockTodoItem, description: updateData.description },
      });

      const result = await todoListService.updateItem(1, updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/TodoList/items/1', updateData);
      expect(result.description).toBe('Updated Description');
    });

    it('should throw error when updating fails', async () => {
      const updateData: UpdateItemRequest = {
        description: 'Updated Description',
      };
      const error = new Error('Item not found');
      vi.mocked(apiClient.put).mockRejectedValue(error);

      await expect(todoListService.updateItem(999, updateData)).rejects.toThrow('Item not found');
    });
  });

  describe('deleteItem', () => {
    it('should delete a todo item', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined });

      await todoListService.deleteItem(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/TodoList/items/1');
    });

    it('should throw error when deleting fails', async () => {
      const error = new Error('Item not found');
      vi.mocked(apiClient.delete).mockRejectedValue(error);

      await expect(todoListService.deleteItem(999)).rejects.toThrow('Item not found');
    });
  });

  describe('registerProgression', () => {
    it('should register a progression entry', async () => {
      const progressionData: RegisterProgressionRequest = {
        date: '2024-01-02T10:00:00Z',
        percent: 75,
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: undefined });

      await todoListService.registerProgression(1, progressionData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/TodoList/items/1/progressions',
        progressionData,
      );
    });

    it('should throw error when registering progression fails', async () => {
      const progressionData: RegisterProgressionRequest = {
        date: '2024-01-02T10:00:00Z',
        percent: 75,
      };
      const error = new Error('Invalid progression data');
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(todoListService.registerProgression(1, progressionData)).rejects.toThrow(
        'Invalid progression data',
      );
    });
  });

  describe('printItems', () => {
    it('should call print items endpoint', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: undefined });

      await todoListService.printItems();

      expect(apiClient.post).toHaveBeenCalledWith('/api/TodoList/items/print');
    });

    it('should throw error when print fails', async () => {
      const error = new Error('Print error');
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(todoListService.printItems()).rejects.toThrow('Print error');
    });
  });
});
