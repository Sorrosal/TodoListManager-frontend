/**
 * Authentication Models
 * Based on the TodoList Manager API specification
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: UserInfo;
}

export interface UserInfo {
  id?: number;
  username: string;
  email?: string;
}
