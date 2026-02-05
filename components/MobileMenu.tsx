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
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 h-full w-64 bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b flex justify-between items-center">
          <span className="text-xl font-bold text-brand-dark">Menu</span>
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-2">
          <button
            onClick={() => handleNavClick(ViewState.HOME)}
            className="w-full text-left p-4 rounded-xl hover:bg-gray-50 font-bold text-brand-dark"
          >
            {t('navShop')}
          </button>
          <button
            onClick={() => handleNavClick(ViewState.REPAIR_LOOKUP)}
            className="w-full text-left p-4 rounded-xl hover:bg-gray-50 font-bold text-brand-dark"
          >
            {t('navTrack')}
          </button>
          <button
            onClick={() => handleNavClick(ViewState.CUSTOM_CASE)}
            className="w-full text-left p-4 rounded-xl hover:bg-gray-50 font-bold text-brand-dark flex items-center gap-2"
          >
            <Sparkles size={16} /> AI DESIGN
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
