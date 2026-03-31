import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings, type SiteSettings } from '../services/siteSettingsService';
export type { SiteSettings };

const DEFAULT: SiteSettings = {
  siteName: 'TXT Shop',
  logoUrl: '',
  siteDescription: '',
  copyright: '',
  footerColumns: [],
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT);

  useEffect(() => {
    getSiteSettings()
      .then(data => setSettings({ ...DEFAULT, ...data }))
      .catch(() => {/* use defaults */});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
