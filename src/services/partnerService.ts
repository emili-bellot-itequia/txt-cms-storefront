import apiClient from '../apiClient';

export interface StorefrontPartner {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  sortOrder: number;
}

export const getActivePartners = (): Promise<StorefrontPartner[]> =>
  apiClient.get('/storefront/partners').then(r => r.data);
