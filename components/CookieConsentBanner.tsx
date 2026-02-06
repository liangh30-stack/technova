import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, ShieldCheck, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onViewCookiePolicy: () => void;
}

const STORAGE_KEY = 'cookie_consent';

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onViewCookiePolicy }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, 'all');
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(STORAGE_KEY, 'essential');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(STORAGE_KEY, 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      role="dialog"
      aria-label={t('cookieTitle', 'Cookies')}
    >
      <div className="max-w-4xl mx-auto bg-white border border-brand-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Main banner */}
        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Cookie size={20} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-brand-dark mb-1">
                {t('cookieTitle', 'Uso de Cookies')}
              </h3>
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                {t('cookieDescription', 'Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenido. Puedes aceptar todas, rechazar las no esenciales o configurar tus preferencias.')}
              </p>
              <button
                onClick={onViewCookiePolicy}
                className="text-xs text-brand-primary hover:underline mt-1 font-medium"
              >
                {t('cookieSettings', 'Política de Cookies')}
              </button>
            </div>
          </div>

          {/* Settings panel (expandable) */}
          {showSettings && (
            <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
              {/* Essential cookies */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-primary" />
                  <div>
                    <p className="text-xs font-medium text-brand-dark">
                      {t('cookieEssentialLabel', 'Cookies esenciales')}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {t('cookieEssentialDesc', 'Sesión, autenticación, PWA. Siempre activas.')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                  {t('cookieAlwaysActive', 'Siempre activas')}
                </span>
              </div>

              {/* Analytics cookies */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-brand-muted" />
                  <div>
                    <p className="text-xs font-medium text-brand-dark">
                      {t('cookieAnalyticsLabel', 'Cookies de análisis')}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {t('cookieAnalyticsDesc', 'Sentry (monitoreo de rendimiento). Muestreo al 10%.')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-brand-muted bg-gray-200 px-2 py-0.5 rounded-full">
                  {t('cookieRequiresConsent', 'Requiere consentimiento')}
                </span>
              </div>

              {/* Functional cookies */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <Cookie size={16} className="text-brand-muted" />
                  <div>
                    <p className="text-xs font-medium text-brand-dark">
                      {t('cookieFunctionalLabel', 'Cookies funcionales')}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {t('cookieFunctionalDesc', 'Preferencia de idioma (i18next). Siempre activas.')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                  {t('cookieAlwaysActive', 'Siempre activas')}
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleEssentialOnly}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {t('cookieEssentialOnly', 'Solo esenciales')}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
            <button
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs md:text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              {t('cookieAcceptAll', 'Aceptar todas')}
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs md:text-sm font-semibold rounded-lg border border-brand-border text-brand-dark hover:bg-gray-50 transition-colors"
            >
              {t('cookieRejectNonEssential', 'Rechazar no esenciales')}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs md:text-sm font-medium rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Settings size={14} />
              {t('cookieSettings', 'Configurar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
