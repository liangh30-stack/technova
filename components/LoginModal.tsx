import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  loginPin: string;
  setLoginPin: (value: string) => void;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, loginPin, setLoginPin, onClose, onLogin }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white z-[110] rounded-lg border border-brand-border shadow-xl p-8"
        role="dialog"
        aria-modal="true"
        aria-label={t('loginDialogLabel') || 'Staff login'}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LogIn size={36} className="text-white -mr-1" />
          </div>
          <h3 className="text-2xl font-bold text-brand-primary tracking-tight">{t('loginStaffPortal') || 'Staff Portal'}</h3>
          <p className="text-brand-muted text-sm mt-2 font-medium">{t('loginEnterPIN') || 'Enter PIN to access Admin Dashboard'}</p>
        </div>

        <div className="relative group">
          <input
            type="password"
            maxLength={4}
            value={loginPin}
            onChange={e => setLoginPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onLogin()}
            placeholder="••••"
            autoFocus
            className="w-full bg-white border-2 border-brand-border rounded-lg py-5 text-center text-3xl tracking-[0.5em] text-brand-dark focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none mb-8 font-mono transition-all placeholder:tracking-normal placeholder:text-brand-text-tertiary"
            aria-label={t('loginPINInput') || 'Enter your PIN'}
          />
        </div>

        <button
          onClick={onLogin}
          className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-5 rounded-lg font-semibold text-lg active:scale-95 transition-all"
        >
          {t('loginEnterBackend') || 'Enter Backend'}
        </button>

        <p className="text-center text-xs text-brand-text-tertiary mt-6 uppercase tracking-widest font-bold">{t('loginAuthorizedOnly') || 'Authorized Personnel Only'}</p>
      </div>
    </>
  );
};

export default LoginModal;
