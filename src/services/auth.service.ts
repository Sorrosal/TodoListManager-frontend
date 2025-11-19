/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './api.client';
import type { LoginRequest, LoginResponse, UserInfo } from 'src/models';

class AuthService {
  private readonly BASE_PATH = '/api/Auth';

  /**
   * Authenticates a user and returns a JWT token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.BASE_PATH}/login`, credentials);
    return response.data;
  }

  /**
   * Gets the current authenticated user's information
   */
  async getCurrentUser(): Promise<UserInfo> {
    const response = await apiClient.get<UserInfo>(`${this.BASE_PATH}/me`);
    return response.data;
  }

  /**
   * Stores the authentication token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Retrieves the authentication token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Removes the authentication token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Checks if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;
