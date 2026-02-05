import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, Shield, Zap, Globe, ChevronDown } from 'lucide-react';

const Hero3D: React.FC = () => {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const scrollToProducts = () => {
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-[90vh] flex items-center overflow-hidden stripe-gradient"
      onMouseMove={handleMouseMove}
    >
      {/* Animated gradient orbs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(99, 91, 255, 0.8) 0%, transparent 70%)',
          left: `${10 + mousePosition.x * 10}%`,
          top: `${-20 + mousePosition.y * 10}%`,
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%)',
          right: `${5 + mousePosition.x * 5}%`,
          top: `${10 + mousePosition.y * 10}%`,
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(255, 128, 191, 0.8) 0%, transparent 70%)',
          left: `${40 + mousePosition.x * 5}%`,
          bottom: `${-10 + mousePosition.y * 5}%`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">{t('heroNewCollection')}</span>
            </div>

            {/* Main Title - Stripe style large text */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              {t('heroTitle2Line1')}
              <span className="block bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink bg-clip-text text-transparent">
                {t('heroTitle2Line2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/60 max-w-lg leading-relaxed">
              {t('heroSubtitle2')}
            </p>

            {/* CTA Buttons - Stripe style */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={scrollToProducts}
                className="group bg-white text-brand-dark px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-white/25 flex items-center justify-center gap-3"
              >
                {t('heroShopNow')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToProducts}
                className="group bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg transition-all border border-white/20 flex items-center justify-center gap-3"
              >
                <Play size={18} fill="currentColor" />
                {t('heroViewOffers')}
              </button>
            </div>

            {/* Trust indicators - Stripe minimal style */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-brand-cyan" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t('heroWarranty')}</p>
                  <p className="text-white/40 text-xs">Protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Zap size={20} className="text-brand-purple" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t('heroFreeShipping')}</p>
                  <p className="text-white/40 text-xs">Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Globe size={20} className="text-brand-pink" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t('heroRating')}</p>
                  <p className="text-white/40 text-xs">Worldwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Floating Cards - Stripe style */}
          <div className="hidden lg:block relative h-[500px]">
            {/* Main product card */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-3xl shadow-2xl overflow-hidden hover-lift cursor-pointer"
              style={{
                transform: `translate(-50%, -50%) rotateY(${(mousePosition.x - 0.5) * 10}deg) rotateX(${(mousePosition.y - 0.5) * -10}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
              onClick={scrollToProducts}
            >
              <div className="h-48 bg-gradient-to-br from-brand-purple/20 via-brand-cyan/10 to-brand-pink/20 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=200&fit=crop"
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple text-xs font-semibold rounded-full">
                    Bestseller
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    -30%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1">{t('heroFeaturedProduct')}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-brand-dark">€19.99</span>
                  <span className="text-sm text-gray-400 line-through">€29.99</span>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <div
              className="absolute top-10 right-10 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
              style={{
                transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                transition: 'transform 0.5s ease-out',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Orders Today</p>
                  <p className="text-lg font-bold text-brand-dark">2,847</p>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-16 left-0 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
              style={{
                transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * 15}px)`,
                transition: 'transform 0.5s ease-out',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                  <span className="text-brand-purple text-lg">★</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer Rating</p>
                  <p className="text-lg font-bold text-brand-dark">4.9/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/80 transition-colors"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </div>
  );
};

export default Hero3D;
