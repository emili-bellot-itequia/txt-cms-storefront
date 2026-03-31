import apiClient from '../apiClient';

export interface FavoriteIds {
  productIds: number[];
  variantIds: number[];
}

export interface FavoriteItem {
  id: number;
  productId?: number;
  variantId?: number;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variant?: any;
}

export const getFavoriteIds = (): Promise<FavoriteIds> =>
  apiClient.get('/storefront/favorites/ids').then(r => r.data);

export const getFavorites = (): Promise<FavoriteItem[]> =>
  apiClient.get('/storefront/favorites').then(r => r.data);

export const toggleFavorite = (productId?: number, variantId?: number): Promise<{ isFavorite: boolean }> =>
  apiClient.post('/storefront/favorites/toggle', { productId, variantId }).then(r => r.data);
