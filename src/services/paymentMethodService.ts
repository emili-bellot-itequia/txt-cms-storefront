import apiClient from '../apiClient';

export interface StorefrontPaymentMethod {
  id: number;
  name: string;
  logoUrl: string;
  sortOrder: number;
}

export const getActivePaymentMethods = (): Promise<StorefrontPaymentMethod[]> =>
  apiClient.get('/storefront/payment-methods').then(r => r.data);
