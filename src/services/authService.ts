import apiClient from '../apiClient';
import type { AuthResponse } from '../types';

export const register = async (data: { name: string; email: string; password: string; phone?: string; taxId?: string }): Promise<AuthResponse> => {
  const res = await apiClient.post('/storefront/auth/register', data);
  return res.data;
};

export const login = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await apiClient.post('/storefront/auth/login', data);
  return res.data;
};
