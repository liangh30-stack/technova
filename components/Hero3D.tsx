import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield, Zap, Globe, ChevronDown } from 'lucide-react';

const Hero3D: React.FC = () => {
  const { t } = useTranslation();

  const scrollToProducts = () => {
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[60vh] flex items-center overflow-hidden pro-hero-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-primary-light px-4 py-2 rounded-lg border border-brand-primary/10">
              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
              <span className="text-brand-primary text-sm font-semibold">{t('heroNewCollection')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-[1.1] tracking-tight">
              {t('heroTitle2Line1')}
              <span className="block text-brand-primary">
                {t('heroTitle2Line2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-brand-muted max-w-lg leading-relaxed">
              {t('heroSubtitle2')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={scrollToProducts}
                className="group bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {t('heroShopNow')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToProducts}
                className="group bg-white hover:bg-brand-light text-brand-dark px-6 py-3 rounded-lg font-semibold text-base transition-colors border border-brand-border flex items-center justify-center gap-2 shadow-sm"
              >
                {t('heroViewOffers')}
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-brand-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-primary-light rounded-lg flex items-center justify-center">
                  <Shield size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-brand-dark font-semibold text-sm">{t('heroWarranty')}</p>
                  <p className="text-brand-text-tertiary text-xs">{t('heroProtection') || 'Protection'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-primary-light rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-brand-dark font-semibold text-sm">{t('heroFreeShipping')}</p>
                  <p className="text-brand-text-tertiary text-xs">{t('heroDelivery') || 'Delivery'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-primary-light rounded-lg flex items-center justify-center">
                  <Globe size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-brand-dark font-semibold text-sm">{t('heroRating')}</p>
                  <p className="text-brand-text-tertiary text-xs">{t('heroWorldwide') || 'Worldwide'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Card */}
          <div className="hidden lg:block relative h-[420px]">
            {/* Main product card */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-lg border border-brand-border shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={scrollToProducts}
            >
              <div className="h-48 bg-brand-light flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=200&fit=crop"
                  alt="Featured product"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-brand-primary-light text-brand-primary text-xs font-semibold rounded">
                    {t('heroBestseller') || 'Bestseller'}
                  </span>
                  <span className="px-2 py-0.5 bg-brand-accent-light text-brand-accent text-xs font-semibold rounded">
                    {t('heroDiscount') || '-30%'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1">{t('heroFeaturedProduct')}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-brand-dark">€19.99</span>
                  <span className="text-sm text-brand-text-tertiary line-through">€29.99</span>
                </div>
              </div>
            </div>

            {/* Stat card - Orders */}
            <div className="absolute top-8 right-8 bg-white rounded-lg p-4 shadow-md border border-brand-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-primary-light rounded-lg flex items-center justify-center">
                  <span className="text-brand-primary text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-xs text-brand-text-tertiary">{t('heroOrdersToday') || 'Orders Today'}</p>
                  <p className="text-lg font-bold text-brand-dark">{t('heroOrdersCount') || '2,847'}</p>
                </div>
              </div>
            </div>

            {/* Stat card - Rating */}
            <div className="absolute bottom-12 left-0 bg-white rounded-lg p-4 shadow-md border border-brand-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-accent-light rounded-lg flex items-center justify-center">
                  <span className="text-brand-accent text-sm">★</span>
                </div>
                <div>
                  <p className="text-xs text-brand-text-tertiary">{t('heroCustomerRating') || 'Customer Rating'}</p>
                  <p className="text-lg font-bold text-brand-dark">{t('heroRatingValue') || '4.9/5.0'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brand-text-tertiary hover:text-brand-primary transition-colors"
        aria-label="Scroll to products"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </button>
    </div>
  );
};

export default Hero3D;
