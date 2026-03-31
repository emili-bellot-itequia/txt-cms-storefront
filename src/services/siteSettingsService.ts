import apiClient from '../apiClient';

export type FooterColumnType = 'links' | 'logos' | 'features' | 'paymentMethods' | 'partners';

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterLogo {
  imageUrl: string;
  alt: string;
  href?: string;
}

export interface FooterFeature {
  icon: string;
  text: string;
}

export interface FooterColumn {
  title: string;
  type: FooterColumnType;
  isPredefined?: boolean;
  isVisible: boolean;
  links: FooterLink[];
  logos: FooterLogo[];
  features: FooterFeature[];
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  siteDescription: string;
  copyright: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tikTokUrl?: string;
  pinterestUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedInUrl?: string;
  footerColumns: FooterColumn[];
}

export const getSiteSettings = (): Promise<SiteSettings> =>
  apiClient.get('/storefront/site-settings').then(r => r.data);
