import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import './CookieBanner.css';

const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const { prefs, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const [showConfig, setShowConfig] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [personalization, setPersonalization] = useState(true);

  // Already consented — nothing to show
  if (prefs !== null) return null;

  const handleSave = () => saveCustom({ analytics, personalization });

  return (
    <div className="cookie-banner" role="region" aria-label={t('cookies.bannerLabel')}>
      {!showConfig ? (
        <div className="cookie-bar">
          <p className="cookie-bar-text">
            {t('cookies.bannerText')}{' '}
            <a href="/politica-de-cookies">{t('cookies.learnMore')}</a>
          </p>
          <div className="cookie-bar-actions">
            <button className="btn btn-outline-secondary btn-sm" onClick={rejectAll}>
              {t('cookies.rejectAll')}
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowConfig(true)}>
              {t('cookies.configure')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={acceptAll}>
              {t('cookies.acceptAll')}
            </button>
          </div>
        </div>
      ) : (
        <div className="cookie-config">
          <h6 className="cookie-config-title">{t('cookies.configTitle')}</h6>

          {/* Technical — always active */}
          <div className="cookie-cat">
            <div className="cookie-cat-info">
              <span className="cookie-cat-name">{t('cookies.technical')}</span>
              <span className="cookie-cat-desc">{t('cookies.technicalDesc')}</span>
            </div>
            <span className="cookie-cat-always">{t('cookies.alwaysActive')}</span>
          </div>

          {/* Analytics */}
          <div className="cookie-cat">
            <div className="cookie-cat-info">
              <span className="cookie-cat-name">{t('cookies.analytics')}</span>
              <span className="cookie-cat-desc">{t('cookies.analyticsDesc')}</span>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={analytics}
                onChange={e => setAnalytics(e.target.checked)}
              />
            </div>
          </div>

          {/* Personalization */}
          <div className="cookie-cat">
            <div className="cookie-cat-info">
              <span className="cookie-cat-name">{t('cookies.personalization')}</span>
              <span className="cookie-cat-desc">{t('cookies.personalizationDesc')}</span>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={personalization}
                onChange={e => setPersonalization(e.target.checked)}
              />
            </div>
          </div>

          <div className="cookie-config-footer">
            <button className="btn btn-outline-secondary btn-sm" onClick={rejectAll}>
              {t('cookies.rejectAll')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              {t('cookies.savePreferences')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={acceptAll}>
              {t('cookies.acceptAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieBanner;
