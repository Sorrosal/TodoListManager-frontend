import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../auth.service';
import { apiClient } from '../api.client';
import type { LoginRequest, LoginResponse, UserInfo } from 'src/models';

vi.mock('../api.client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('AuthService', () => {
  const mockLoginRequest: LoginRequest = {
    username: 'testuser',
    password: 'testpass123',
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token',
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    },
  };

  const mockUserInfo: UserInfo = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('should call API with correct credentials and return response', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockLoginResponse });

      const result = await authService.login(mockLoginRequest);

      expect(apiClient.post).toHaveBeenCalledWith('/api/Auth/login', mockLoginRequest);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should throw error when login fails', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(authService.login(mockLoginRequest)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user information', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockUserInfo });

      const result = await authService.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/api/Auth/me');
      expect(result).toEqual(mockUserInfo);
    });

    it('should throw error when fetching user fails', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Token Management', () => {
    describe('setToken', () => {
      it('should store token in localStorage', () => {
        const token = 'test-token-123';
        authService.setToken(token);

        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', token);
      });
    });

    describe('getToken', () => {
      it('should retrieve token from localStorage', () => {
        const token = 'test-token-123';
        vi.mocked(localStorage.getItem).mockReturnValue(token);

        const result = authService.getToken();

        expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
        expect(result).toBe(token);
      });

      it('should return null when no token exists', () => {
        vi.mocked(localStorage.getItem).mockReturnValue(null);

        const result = authService.getToken();

        expect(result).toBeNull();
      });
    });

    describe('removeToken', () => {
      it('should remove token from localStorage', () => {
        authService.removeToken();

        expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      });
    });

    describe('isAuthenticated', () => {
      it('should return true when token exists', () => {
        vi.mocked(localStorage.getItem).mockReturnValue('test-token');

        const result = authService.isAuthenticated();

        expect(result).toBe(true);
      });

      it('should return false when token does not exist', () => {
        vi.mocked(localStorage.getItem).mockReturnValue(null);

        const result = authService.isAuthenticated();

        expect(result).toBe(false);
      });
    });
  });
});
