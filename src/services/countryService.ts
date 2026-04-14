import apiClient from '../apiClient';

export interface VisibleCountry {
  isoCode: string;
  name: string;
}

export const getVisibleCountries = (): Promise<VisibleCountry[]> =>
  apiClient.get('/countries/visible').then(r => r.data);
