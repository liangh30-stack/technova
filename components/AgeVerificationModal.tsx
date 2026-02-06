import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Calendar, X, AlertTriangle, UserCheck } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: (isAdult: boolean) => void;
  onClose: () => void;
  minimumAge?: number;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onVerified,
  onClose,
  minimumAge = 14,
}) => {
  const { t } = useTranslation();
  const [birthDate, setBirthDate] = useState('');
  const [parentalConsent, setParentalConsent] = useState(false);
  const [showMinorMessage, setShowMinorMessage] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculateAge = (dateString: string): number => {
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleVerify = () => {
    setError('');
    setShowMinorMessage(false);

    if (!birthDate) {
      setError(t('ageVerifyErrorDate', 'Debe introducir su fecha de nacimiento'));
      return;
    }

    const age = calculateAge(birthDate);

    if (age < 0 || age > 120) {
      setError(t('ageVerifyErrorInvalid', 'Fecha de nacimiento no valida'));
      return;
    }

    if (age < minimumAge) {
      setShowMinorMessage(true);
      return;
    }

    if (age < 16 && !parentalConsent) {
      setError(t('ageVerifyErrorParental', 'Los menores de 16 anos necesitan consentimiento de su tutor legal'));
      return;
    }

    onVerified(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={t('ageVerifyTitle', 'Verificacion de edad')}>
      <div className="bg-white rounded-2xl border border-brand-border shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark transition-colors z-10"
          aria-label={t('ageVerifyClose', 'Cerrar')}
        >
          <X size={20} />
        </button>

        {/* Header with brand accent */}
        <div className="bg-brand-primary/5 border-b border-brand-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <ShieldAlert size={24} className="text-brand-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-dark">
                {t('ageVerifyTitle', 'Verificacion de Edad')}
              </h2>
              <p className="text-xs text-brand-muted">
                {t('ageVerifySubtitle', 'Proteccion de datos de menores - RGPD Art. 8 / LOPDGDD Art. 7')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {showMinorMessage ? (
            /* Minor message */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} className="text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-brand-dark">
                {t('ageVerifyMinorTitle', 'Acceso restringido')}
              </h3>
              <p className="text-sm text-brand-muted">
                {t('ageVerifyMinorDesc', 'Conforme al RGPD y la LOPDGDD, los menores de {{age}} anos no pueden crear una cuenta sin el consentimiento verificable de su padre, madre o tutor legal.', { age: minimumAge })}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-xs font-medium text-brand-dark mb-2">
                  {t('ageVerifyMinorContact', 'Si eres menor y necesitas acceder:')}
                </p>
                <ul className="text-xs text-brand-muted space-y-1 list-disc list-inside">
                  <li>{t('ageVerifyMinorStep1', 'Pide a tu padre, madre o tutor que contacte con nosotros')}</li>
                  <li>{t('ageVerifyMinorStep2', 'Email de contacto: [EMAIL_CONTACTO]')}</li>
                  <li>{t('ageVerifyMinorStep3', 'El tutor debera proporcionar consentimiento verificable')}</li>
                </ul>
              </div>
              <button
                onClick={() => { setShowMinorMessage(false); onVerified(false); }}
                className="w-full px-5 py-2.5 text-sm font-semibold rounded-lg border border-brand-border text-brand-dark hover:bg-gray-50 transition-colors"
              >
                {t('ageVerifyMinorClose', 'Entendido')}
              </button>
            </div>
          ) : (
            /* Verification form */
            <>
              <p className="text-sm text-brand-muted">
                {t('ageVerifyDescription', 'Para proteger los datos personales de menores conforme al RGPD, necesitamos verificar su edad antes de proceder.')}
              </p>

              {/* Date of birth */}
              <div>
                <label htmlFor="age-verify-dob" className="block text-sm font-semibold text-brand-dark mb-1.5">
                  {t('ageVerifyDateLabel', 'Fecha de nacimiento')}
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    id="age-verify-dob"
                    type="date"
                    value={birthDate}
                    onChange={(e) => { setBirthDate(e.target.value); setError(''); setShowMinorMessage(false); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Parental consent for 14-15 year olds */}
              {birthDate && calculateAge(birthDate) >= minimumAge && calculateAge(birthDate) < 16 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      {t('ageVerifyParentalWarning', 'Los menores de 16 anos necesitan consentimiento parental conforme al art. 7 de la LOPDGDD.')}
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parentalConsent}
                      onChange={(e) => setParentalConsent(e.target.checked)}
                      className="mt-0.5 accent-brand-primary"
                    />
                    <span className="text-xs text-brand-muted">
                      {t('ageVerifyParentalConsent', 'Confirmo que cuento con el consentimiento de mi padre, madre o tutor legal para crear una cuenta y tratar mis datos personales.')}
                    </span>
                  </label>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleVerify}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
                >
                  <UserCheck size={16} />
                  {t('ageVerifyConfirm', 'Verificar edad')}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold rounded-lg border border-brand-border text-brand-dark hover:bg-gray-50 transition-colors"
                >
                  {t('ageVerifyCancel', 'Cancelar')}
                </button>
              </div>

              {/* Legal footer */}
              <p className="text-[10px] text-brand-muted text-center leading-relaxed">
                {t('ageVerifyLegalNote', 'Esta verificacion se realiza conforme al art. 8 del RGPD (UE 2016/679) y art. 7 de la LOPDGDD (LO 3/2018). Los datos introducidos no se almacenan y se utilizan unicamente para verificar la edad.')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
