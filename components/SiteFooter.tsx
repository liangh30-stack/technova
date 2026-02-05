import React from 'react';
import { ViewState } from '../types';

interface SiteFooterProps {
  onOpenLogin: () => void;
  setView: (view: ViewState) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLogin, setView }) => {
  return (
    <footer className="bg-brand-dark text-white py-16 px-4 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold tracking-tight">TechNova</h3>
          <p className="text-gray-400 text-sm font-light">Professional Mobile Repair & Premium Fashion Accessories. Redefining your tech experience since 2018.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-pink">Support</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setView(ViewState.REPAIR_LOOKUP); window.scrollTo(0,0); }}>Track Order</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-pink">Design</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setView(ViewState.CUSTOM_CASE); window.scrollTo(0,0); }}>AI Custom Case</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-pink">Portal</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="hover:text-white cursor-pointer transition-colors" onClick={onOpenLogin}>Staff Login</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setView(ViewState.ADMIN); window.scrollTo(0,0); }}>Admin Panel</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-500 font-medium">
        &copy; {new Date().getFullYear()} TechNova Ecosystem. All rights reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;
