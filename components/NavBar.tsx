import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, Globe, Menu, Sparkles, Settings, ChevronDown } from 'lucide-react';
import { ViewState, Language } from '../types';
import { LegacyLanguage } from '../i18n';
import { AdminUser } from '../services/authService';

interface NavBarProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  lang: Language;
  onLanguageChange: (lang: LegacyLanguage) => void;
  isLangMenuOpen: boolean;
  setIsLangMenuOpen: (open: boolean) => void;
  cartItemCount: number;
  onCartClick: () => void;
  onUserClick: () => void;
  onMobileMenuClick: () => void;
  adminUser: AdminUser | null;
  currentUser: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  view,
  setView,
  lang,
  onLanguageChange,
  isLangMenuOpen,
  setIsLangMenuOpen,
  cartItemCount,
  onCartClick,
  onUserClick,
  onMobileMenuClick,
  adminUser,
  currentUser,
}) => {
  const { t } = useTranslation();

  const navItems = [
    { label: t('navShop'), view: ViewState.HOME },
    { label: t('navTrack'), view: ViewState.REPAIR_LOOKUP },
    { label: t('aiDesignNav') || 'AI Design', view: ViewState.CUSTOM_CASE, icon: Sparkles },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white border-b border-brand-border" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView(ViewState.HOME)}
          >
            <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm group-hover:bg-brand-primary-dark transition-colors">
              <span className="text-white font-bold text-sm">TN</span>
            </div>
            <span className="text-xl font-bold text-brand-dark tracking-tight">TechNova</span>
          </div>

          {/* Center Nav - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = view === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => { setView(item.view); window.scrollTo(0, 0); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary-light font-semibold'
                      : 'text-brand-muted hover:text-brand-dark hover:bg-brand-light'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-brand-muted hover:text-brand-dark transition-colors px-3 py-2 rounded-lg hover:bg-brand-light"
                aria-label="Select language"
                aria-expanded={isLangMenuOpen}
              >
                <Globe size={16} />
                <span className="text-xs font-medium">{lang}</span>
                <ChevronDown size={12} />
              </button>
              {isLangMenuOpen && (
                <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-brand-border overflow-hidden min-w-[120px] py-1">
                  {(['EN', 'CN', 'ES', 'FR', 'DE'] as LegacyLanguage[]).map(l => (
                    <button
                      key={l}
                      onClick={() => onLanguageChange(l)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                        lang === l
                          ? 'text-brand-primary bg-brand-primary-light'
                          : 'text-brand-muted hover:text-brand-dark hover:bg-brand-light'
                      }`}
                    >
                      {l === 'EN' && '🇺🇸 English'}
                      {l === 'CN' && '🇨🇳 中文'}
                      {l === 'ES' && '🇪🇸 Español'}
                      {l === 'FR' && '🇫🇷 Français'}
                      {l === 'DE' && '🇩🇪 Deutsch'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-brand-muted hover:text-brand-dark transition-colors rounded-lg hover:bg-brand-light"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-critical text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Admin Panel */}
            {adminUser && (
              <button
                onClick={() => { setView(ViewState.ADMIN); window.scrollTo(0, 0); }}
                className={`p-2 rounded-lg transition-colors ${
                  view === ViewState.ADMIN
                    ? 'text-brand-primary bg-brand-primary-light'
                    : 'text-brand-muted hover:text-brand-dark hover:bg-brand-light'
                }`}
                title="Admin Panel"
                aria-label="Admin Panel"
              >
                <Settings size={20} />
              </button>
            )}

            {/* User */}
            <button
              className={`p-2 rounded-lg transition-colors ${
                currentUser
                  ? 'text-brand-primary bg-brand-primary-light'
                  : 'text-brand-muted hover:text-brand-dark hover:bg-brand-light'
              }`}
              onClick={onUserClick}
              aria-label="User account"
            >
              <User size={20} />
            </button>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-brand-muted hover:text-brand-dark rounded-lg hover:bg-brand-light"
              onClick={onMobileMenuClick}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
