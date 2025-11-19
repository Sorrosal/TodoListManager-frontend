/**
 * TodoList Service
 * Handles all todo list-related API calls
 */

import { apiClient } from './api.client';
import type {
  TodoItem,
  AddItemRequest,
  UpdateItemRequest,
  RegisterProgressionRequest,
  TodoListResponse,
} from 'src/models';

class TodoListService {
  private readonly BASE_PATH = '/api/TodoList';

  /**
   * Gets all todo items
   */
  async getAllItems(): Promise<TodoItem[]> {
    const response = await apiClient.get<TodoListResponse>(`${this.BASE_PATH}/items`);
    return response.data.items;
  }

  /**
   * Adds a new todo item
   */
  async addItem(item: AddItemRequest): Promise<TodoItem> {
    const response = await apiClient.post<TodoItem>(`${this.BASE_PATH}/items`, item);
    return response.data;
  }

  /**
   * Updates the description of an existing todo item
   */
  async updateItem(id: number, update: UpdateItemRequest): Promise<TodoItem> {
    const response = await apiClient.put<TodoItem>(`${this.BASE_PATH}/items/${id}`, update);
    return response.data;
  }

  /**
   * Removes a todo item
   */
  async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/items/${id}`);
  }

  /**
   * Registers a progression entry for a todo item
   */
  async registerProgression(id: number, progression: RegisterProgressionRequest): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/items/${id}/progressions`, progression);
  }

  /**
   * Prints all todo items to the console (for debugging)
   */
  async printItems(): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/items/print`);
  }
}

export const todoListService = new TodoListService();
export default todoListService;
