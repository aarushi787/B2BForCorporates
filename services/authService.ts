import { User } from '../types';
import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
  gstNumber: string;
  industry?: string;
  companyDomain?: string;
  website?: string;
  address?: string;
  description?: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/register', data);
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {});
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return apiClient.put<User>('/auth/profile', updates);
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ valid: boolean }>('/auth/validate-token', { token });
      return response.valid;
    } catch {
      return false;
    }
  },
};
