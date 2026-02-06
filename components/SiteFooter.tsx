import React from 'react';
import { useTranslation } from 'react-i18next';
import { ViewState } from '../types';

interface SiteFooterProps {
  onOpenLogin: () => void;
  setView: (view: ViewState) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLogin, setView }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-dark text-white py-16 px-4 border-t border-[#333333]" aria-label="Site footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold tracking-tight">TechNova</h3>
          <p className="text-gray-400 text-sm font-light">{t('footerDescription') || 'Professional Mobile Repair & Premium Accessories. Redefining your tech experience since 2018.'}</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-text-tertiary">{t('footerSupport') || 'Support'}</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li>
              <button className="hover:text-white transition-colors text-left">{t('footerHelpCenter') || 'Help Center'}</button>
            </li>
            <li>
              <button className="hover:text-white transition-colors text-left" onClick={() => { setView(ViewState.REPAIR_LOOKUP); window.scrollTo(0,0); }}>{t('footerTrackOrder') || 'Track Order'}</button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-text-tertiary">{t('footerDesign') || 'Design'}</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li>
              <button className="hover:text-white transition-colors text-left" onClick={() => { setView(ViewState.CUSTOM_CASE); window.scrollTo(0,0); }}>{t('footerAICustomCase') || 'AI Custom Case'}</button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-text-tertiary">{t('footerPortal') || 'Portal'}</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li>
              <button className="hover:text-white transition-colors text-left" onClick={onOpenLogin}>{t('footerStaffLogin') || 'Staff Login'}</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#333333] text-center text-xs text-gray-500 font-medium">
        &copy; {new Date().getFullYear()} {t('footerCopyright') || 'TechNova Ecosystem. All rights reserved.'}
      </div>
    </footer>
  );
};

export default SiteFooter;
