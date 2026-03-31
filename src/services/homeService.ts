import apiClient from '../apiClient';

export interface StorefrontHomeBlock {
  id: number;
  title: string;
  type: 'Banner' | 'ImageGrid' | 'FeaturedProducts' | 'ImageText';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  isActive: boolean;
  sortOrder: number;
}

export const getHomeBlocks = (): Promise<StorefrontHomeBlock[]> =>
  apiClient.get('/storefront/home').then(r => r.data);
