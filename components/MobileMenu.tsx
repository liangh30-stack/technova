import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewState) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, setView }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleNavClick = (view: ViewState) => {
    setView(view);
    onClose();
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-brand-dark/40 z-[60] animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed left-0 top-0 h-full w-72 bg-white z-[70] shadow-lg border-r border-brand-border flex flex-col animate-in slide-in-from-left duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="p-6 border-b border-brand-border flex justify-between items-center">
          <span className="text-xl font-bold text-brand-dark">{t('mobileMenuTitle') || 'Menu'}</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-brand-light transition-colors" aria-label="Close menu">
            <X size={24} className="text-brand-muted" />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-1">
          <button
            onClick={() => handleNavClick(ViewState.HOME)}
            className="w-full text-left p-4 rounded-lg hover:bg-brand-light font-semibold text-brand-dark transition-colors"
            role="menuitem"
          >
            {t('navShop')}
          </button>
          <button
            onClick={() => handleNavClick(ViewState.REPAIR_LOOKUP)}
            className="w-full text-left p-4 rounded-lg hover:bg-brand-light font-semibold text-brand-dark transition-colors"
            role="menuitem"
          >
            {t('navTrack')}
          </button>
          <button
            onClick={() => handleNavClick(ViewState.CUSTOM_CASE)}
            className="w-full text-left p-4 rounded-lg hover:bg-brand-light font-semibold text-brand-dark flex items-center gap-2 transition-colors"
            role="menuitem"
          >
            <Sparkles size={16} className="text-brand-primary" /> {t('aiDesignNav') || 'AI Design'}
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
