import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, CheckCircle, Shield, X, Bell } from 'lucide-react';

interface NewsletterConsentProps {
  onSubscribe: (data: NewsletterSubscriptionData) => void;
  onDismiss: () => void;
  variant?: 'inline' | 'modal';
}

export interface NewsletterSubscriptionData {
  email: string;
  consentMarketing: boolean;
  consentThirdParty: boolean;
  timestamp: string;
  language: string;
}

const NewsletterConsent: React.FC<NewsletterConsentProps> = ({ onSubscribe, onDismiss, variant = 'inline' }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('newsletterErrorEmail', 'Correo electronico invalido'));
      return;
    }

    if (!consentMarketing) {
      setError(t('newsletterErrorConsent', 'Debe aceptar recibir comunicaciones comerciales'));
      return;
    }

    onSubscribe({
      email,
      consentMarketing,
      consentThirdParty,
      timestamp: new Date().toISOString(),
      language: i18n.language,
    });

    setSubmitted(true);
  };

  const containerClass = variant === 'modal'
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
    : '';

  const cardClass = variant === 'modal'
    ? 'bg-white rounded-2xl border border-brand-border shadow-2xl max-w-md w-full relative'
    : 'bg-white rounded-2xl border border-brand-border shadow-sm';

  if (submitted) {
    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="p-6 md:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">
              {t('newsletterSuccessTitle', 'Suscripcion confirmada')}
            </h3>
            <p className="text-sm text-brand-muted mb-4">
              {t('newsletterSuccessDesc', 'Gracias por suscribirte. Conforme a la LSSI-CE, puede darse de baja en cualquier momento a traves del enlace incluido en cada correo.')}
            </p>
            <button
              onClick={onDismiss}
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
            >
              {t('newsletterSuccessClose', 'Cerrar')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        {/* Close button for modal */}
        {variant === 'modal' && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark transition-colors"
            aria-label={t('newsletterClose', 'Cerrar')}
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Bell size={20} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-brand-dark">
                {t('newsletterTitle', 'Suscribete a nuestro boletin')}
              </h3>
              <p className="text-xs text-brand-muted">
                {t('newsletterSubtitle', 'Ofertas exclusivas y novedades')}
              </p>
            </div>
          </div>

          <p className="text-sm text-brand-muted mb-5">
            {t('newsletterDescription', 'Recibe ofertas exclusivas, novedades de productos y consejos tecnicos directamente en tu bandeja de entrada.')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="newsletter-email" className="block text-sm font-semibold text-brand-dark mb-1.5">
                {t('newsletterEmailLabel', 'Correo electronico')}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                  placeholder={t('newsletterEmailPlaceholder', 'tu@email.com')}
                />
              </div>
            </div>

            {/* LSSI-CE mandatory explicit consent checkboxes */}
            <div className="space-y-3">
              {/* Marketing consent (mandatory) */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  className="mt-0.5 accent-brand-primary"
                />
                <span className="text-xs text-brand-muted leading-relaxed">
                  {t('newsletterConsentMarketing', 'Acepto recibir comunicaciones comerciales electronicas de [NOMBRE_EMPRESA] sobre productos, ofertas y novedades conforme al art. 21 de la LSSI-CE.')} *
                </span>
              </label>

              {/* Third-party consent (optional) */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentThirdParty}
                  onChange={(e) => setConsentThirdParty(e.target.checked)}
                  className="mt-0.5 accent-brand-primary"
                />
                <span className="text-xs text-brand-muted leading-relaxed">
                  {t('newsletterConsentThirdParty', 'Acepto recibir comunicaciones de socios seleccionados relacionadas con tecnologia y accesorios.')}
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              <Mail size={16} />
              {t('newsletterSubscribe', 'Suscribirme')}
            </button>

            {/* Legal notice */}
            <div className="flex items-start gap-2 pt-2">
              <Shield size={12} className="text-brand-muted flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-muted leading-relaxed">
                {t('newsletterLegalNotice', 'Responsable: [NOMBRE_EMPRESA]. Finalidad: envio de comunicaciones comerciales. Base legal: consentimiento del interesado (art. 6.1.a RGPD y art. 21 LSSI-CE). Puede retirar su consentimiento en cualquier momento. Mas informacion en nuestra Politica de Privacidad.')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterConsent;
