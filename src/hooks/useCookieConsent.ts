import { useState } from 'react';

const STORAGE_KEY = 'cookie_consent';

export interface CookieConsentPrefs {
  analytics: boolean;
  personalization: boolean;
}

interface UseCookieConsentResult {
  prefs: CookieConsentPrefs | null;
  acceptAll: () => void;
  rejectAll: () => void;
  saveCustom: (prefs: CookieConsentPrefs) => void;
}

export function useCookieConsent(): UseCookieConsentResult {
  const [prefs, setPrefs] = useState<CookieConsentPrefs | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CookieConsentPrefs) : null;
    } catch {
      return null;
    }
  });

  const save = (p: CookieConsentPrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setPrefs(p);
  };

  return {
    prefs,
    acceptAll:   () => save({ analytics: true,  personalization: true  }),
    rejectAll:   () => save({ analytics: false, personalization: false }),
    saveCustom:  save,
  };
}
