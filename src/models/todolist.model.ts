/**
 * TodoList Models
 * Based on the TodoList Manager API specification
 */

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  category: string;
  totalProgress: number;
  isCompleted: boolean;
  lastProgressionDate: string | null;
  progressions: ProgressionEntry[];
}

export interface AddItemRequest {
  title: string;
  description: string;
  category: string;
}

export interface UpdateItemRequest {
  description: string;
}

export interface RegisterProgressionRequest {
  date: string; // ISO 8601 format: Date-time
  percent: number;
}

export interface ProgressionEntry {
  id?: number;
  date: string;
  percent: number;
  todoItemId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface TodoListResponse {
  items: TodoItem[];
  totalCount: number;
}
