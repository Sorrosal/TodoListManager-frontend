/**
 * Axios API Client
 * Centralized HTTP client configuration with interceptors
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { Notify } from 'quasar';

const API_URL = process.env.API_URL || 'https://localhost:7292';

class ApiClient {
  private client: AxiosInstance;
  // Simple cache to avoid showing duplicate notifications in a short time window
  private recentNotifications: Map<string, number> = new Map();
  private notificationTtl = 2000; // ms

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(new Error(error.message));
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Handle specific status codes
          if (error.response.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('auth_token');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          } else {
            // For other statuses, try to extract a useful message from the response
            const data: unknown = error.response.data;
            let message = 'An error occurred';

            if (!data) {
              message = `Request failed with status ${error.response.status}`;
            } else if (typeof data === 'string') {
              message = data;
            } else if (
              typeof data === 'object' &&
              data !== null &&
              'error' in data &&
              typeof (data as { error?: unknown }).error === 'string'
            ) {
              // API sometimes returns { error: '...' }
              message = (data as { error: string }).error;
              // API sometimes returns { error: '...' }
            } else if (
              typeof data === 'object' &&
              data !== null &&
              'message' in data &&
              typeof (data as { message?: unknown }).message === 'string'
            ) {
              message = (data as { message: string }).message;
            } else if (
              typeof data === 'object' &&
              data !== null &&
              'errors' in data
            ) {
              // errors can be an object with arrays or an array of strings
              const errorsField = (data as { errors: unknown }).errors;
              if (Array.isArray(errorsField)) {
                message = errorsField.join(', ');
              } else if (errorsField && typeof errorsField === 'object') {
                // Collect first messages
                const parts: string[] = [];
                Object.values(errorsField).forEach((val) => {
                  if (Array.isArray(val)) {
                    parts.push(...val.map((v) => String(v)));
                  } else if (typeof val === 'string') {
                    parts.push(val);
                  }
                });
                if (parts.length) {
                  message = parts.join(' | ');
                }
              }
            } else {
              // fallback to status text
              message = error.response.statusText || message;
            }

            // Show notification to the user, but avoid duplicates within a short window
            const now = Date.now();
            const key = `error:${message}`;
            const last = this.recentNotifications.get(key) ?? 0;
            if (now - last > this.notificationTtl) {
              this.recentNotifications.set(key, now);
              Notify.create({
                type: 'negative',
                message,
                position: 'top',
              });
            }
          }
        } else if (error.request) {
          Notify.create({
            type: 'negative',
            message: 'Network error. Please check your connection.',
            position: 'top',
          });
        }
        return Promise.reject(error);
      }
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
export default apiClient;
