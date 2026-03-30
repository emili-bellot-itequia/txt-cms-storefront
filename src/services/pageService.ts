import apiClient from '../apiClient';
import type { StorefrontMenuItem, StorefrontPageDetail } from '../types';

export const getMenu = async (): Promise<StorefrontMenuItem[]> => {
  const res = await apiClient.get('/storefront/menu');
  return res.data;
};

export const getPageBySlug = async (slug: string, page = 1, pageSize = 12): Promise<StorefrontPageDetail> => {
  const res = await apiClient.get(`/storefront/pages/${slug}`, { params: { page, pageSize } });
  return res.data;
};
