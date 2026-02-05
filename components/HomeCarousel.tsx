import React from 'react';
import { useTranslation } from 'react-i18next';

interface HomeCarouselProps {
  carouselIndex: number;
  setCarouselIndex: (index: number) => void;
  layerOne: React.ReactNode;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ carouselIndex, setCarouselIndex, layerOne }) => {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden h-[500px]">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${carouselIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        {layerOne}
      </div>

      <div className={`absolute inset-0 transition-opacity duration-1000 ${carouselIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        <div className="relative bg-brand-pink text-white h-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-xs font-bold tracking-widest mb-4 uppercase">{t('heroNewCollection')}</span>
            <h1 className="text-5xl md:text-8xl font-black mb-4 leading-tight tracking-tight uppercase drop-shadow-lg">{t('heroTitle')}</h1>
            <p className="text-xl md:text-3xl font-light text-white/90 mb-8 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
            <button onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-brand-pink font-bold py-4 px-12 rounded-full text-xl hover:shadow-2xl transition-all active:scale-95">{t('heroShopNow')}</button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        <div
          className={`w-3 h-3 rounded-full transition-all cursor-pointer ${carouselIndex === 0 ? 'bg-white w-10 ring-2 ring-white/20' : 'bg-white/40 hover:bg-white/60'}`}
          onClick={() => setCarouselIndex(0)}
        />
        <div
          className={`w-3 h-3 rounded-full transition-all cursor-pointer ${carouselIndex === 1 ? 'bg-white w-10 ring-2 ring-white/20' : 'bg-white/40 hover:bg-white/60'}`}
          onClick={() => setCarouselIndex(1)}
        />
      </div>
    </div>
  );
};

export default HomeCarousel;
